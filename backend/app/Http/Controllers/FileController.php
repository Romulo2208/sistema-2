<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class FileController extends Controller
{
    public function index()
    {
        try {
            $files = File::all()->map(function ($file) {
                return [
                    'id' => $file->id,
                    'name' => $file->name,
                    'url' => $file->url,
                    'path' => $file->path,
                    'mime_type' => $file->mime_type,
                    'size' => $file->size,
                    'created_at' => $file->created_at,
                ];
            });

            return response()->json($files);
        } catch (\Exception $e) {
            Log::error('Erro ao listar arquivos do banco de dados: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao listar arquivos'], 500);
        }
    }

    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|file|max:10240']);
        $s3 = Storage::disk('minio');
        $file = $request->file('file');

        $originalName = $file->getClientOriginalName();
        $path = $s3->putFile('uploads', $file);
        $url = $s3->url($path);

        $fileModel = File::create([
            'name' => $originalName,
            'path' => $path,
            'url' => $url,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);

        return response()->json([
            'id' => $fileModel->id,
            'name' => $originalName,
            'path' => $path,
        ]);

    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf,doc,docx,jpg,png|max:10240',
            ]);

            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $fileName = time() . '_' . $originalName;
            $path = $file->storeAs('documents', $fileName, 'minio');
            $url = Storage::disk('minio')->url($path);

            $fileModel = File::create([
                'name' => $originalName,
                'path' => $path,
                'url' => $url,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);

            Log::info('Arquivo salvo no banco de dados:', $fileModel->toArray());

            return response()->json([
                'id' => $fileModel->id,
                'name' => $originalName,
                'url' => $url,
                'path' => $path,
            ], 201);
        } catch (\Exception $e) {
            Log::error('Erro ao salvar arquivo: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao salvar arquivo: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {

        try {
            $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $file = File::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado no banco de dados: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            $file->update([
                'name' => $request->input('name'),
            ]);

            Log::info('Arquivo atualizado no banco de dados:', $file->toArray());

            return response()->json([
                'id' => $file->id,
                'name' => $file->name,
                'url' => $file->url,
                'path' => $file->path,
                'mime_type' => $file->mime_type,
                'size' => $file->size,
                'created_at' => $file->created_at,
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao atualizar arquivo: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao atualizar arquivo'], 500);
        }

    }

    public function download($path)
    {
        try {
            $file = File::where('path', $path)->first();

            if (!$file) {
                Log::error('Arquivo não encontrado no banco de dados: ' . $path);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            if (!Storage::disk('minio')->exists($file->path)) {
                Log::error('Arquivo não encontrado no MinIO: ' . $file->path);
                return response()->json(['error' => 'Arquivo não encontrado no armazenamento'], 404);
            }

            $url = Storage::disk('minio')->temporaryUrl($file->path, now()->addMinutes(5));
            return response()->json(['url' => $url]);
        } catch (\Exception $e) {
            Log::error('Erro ao gerar URL assinada: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao gerar URL de download'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $file = File::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado no banco de dados: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            if (!Storage::disk('minio')->exists($file->path)) {
                Log::warning('Arquivo não encontrado no MinIO, mas será removido do banco de dados: ' . $file->path);
            } else {
                Storage::disk('minio')->delete($file->path);
                Log::info('Arquivo deletado do MinIO: ' . $file->path);
            }

            $file->delete();
            Log::info('Arquivo deletado do banco de dados: ' . $id);

            return response()->json(['message' => 'Arquivo deletado com sucesso'], 200);
        } catch (\Exception $e) {
            Log::error('Erro ao deletar arquivo: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao deletar arquivo'], 500);
        }
    }

    public function getUserRole(Request $request)
    {
        $user = Auth::user();
        $role = $user->roles()->pluck('slug')->first();

        return response()->json(['role' => $role]);
    }
}
