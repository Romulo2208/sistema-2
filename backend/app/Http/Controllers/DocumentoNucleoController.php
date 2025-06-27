<?php
namespace App\Http\Controllers;

use App\Models\DocumentoNucleo;
use App\Models\Nucleo;
use App\Models\Comar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\File;
use App\Models\User;
use App\Models\StatusDocumento;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;

class DocumentoNucleoController extends Controller
{
    public function index()
    {

        try {
            $filesDoc = DocumentoNucleo::byUserAndNucleo()
                ->with('nucleo')
                ->get()
                ->map(function ($fileDoc) {
                return [
                    'id' => $fileDoc->id,
                    'name' => $fileDoc->name,
                    'url' => $fileDoc->url,
                    'path' => $fileDoc->path,
                    'mime_type' => $fileDoc->mime_type,
                    'size' => $fileDoc->size,
                    'nucleo_id' => $fileDoc->nucleo_id,
                    'nucleo_nome' => optional($fileDoc->nucleo)->descricao,
                    'user_id' => $fileDoc->user_id,
                    'comar_id' => $fileDoc->comar_id,
                    'status' => $fileDoc->status,
                    'ativo' => $fileDoc->ativo,
                    'created_at' => $fileDoc->created_at,
                ];
            });

            return response()->json($filesDoc);
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

        $usuarioLogado=  auth()->user()->id;


        $nucloeId = auth()->user()->nucleos->first()->id;
        $comarId = auth()->user()->comars->first()->id;

        $year = now()->year;
        DocumentoNucleo::where('nucleo_id', $nucloeId)
            ->whereYear('created_at', $year)
            ->where('ativo', true)
            ->update(['ativo' => false]);

        $originalName = $file->getClientOriginalName();
        $path = $s3->putFile('nucleo-documentos', $file);
        $url = $s3->url($path);

        $fileModel = DocumentoNucleo::create([
            'name' => $originalName,
            'path' => $path,
            'url' => $url,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'user_id' => $usuarioLogado,
            'nucleo_id' => $nucloeId,
            'comar_id' => $comarId,
            'status' => "pendente",
            'ativo' => true,
        ]);

        return response()->json([
            'id' => $fileModel->id,
            'name' => $originalName,
            'url' => $url,
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'nucleo_id' => $fileModel->nucleo_id,
            'nucleo_nome' => optional($fileModel->nucleo)->descricao,
            'ativo' => $fileModel->ativo,
            'created_at' => $fileModel->created_at->toIso8601String(),
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

            $nucloeId = auth()->user()->nucleos->first()->id ?? null;
            if ($nucloeId) {
                $year = now()->year;
                DocumentoNucleo::where('nucleo_id', $nucloeId)
                    ->whereYear('created_at', $year)
                    ->where('ativo', true)
                    ->update(['ativo' => false]);
            }

            $fileModel = DocumentoNucleo::create([
                'name' => $originalName,
                'path' => $path,
                'url' => $url,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
                'ativo' => true,
            ]);

            Log::info('Arquivo salvo no banco de dados:', $fileModel->toArray());

            return response()->json([
                'id' => $fileModel->id,
                'name' => $originalName,
                'url' => $url,
                'path' => $path,
                'nucleo_id' => $fileModel->nucleo_id,
                'nucleo_nome' => optional($fileModel->nucleo)->descricao,
                'ativo' => $fileModel->ativo,
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

            $file = DocumentoNucleo::find($id);

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
                'ativo' => $file->ativo,
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
            $file = DocumentoNucleo::where('path', $path)->first();

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
            $file = DocumentoNucleo::find($id);

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

    public function approve(Request $request, $id)
    {
        try {
            $file = DocumentoNucleo::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado para aprovação: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            $file->status = 'Aprovado Coordenador';
            $file->save();

            StatusDocumento::create([
                'documento_id' => $file->id,
                'id_usuario'   => Auth::id(),
                'acao'         => 'aprovado',
                'descricao'    => $request->input('descricao'),
            ]);

            return response()->json(['message' => 'Arquivo aprovado com sucesso']);
        } catch (\Exception $e) {
            Log::error('Erro ao aprovar arquivo: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao aprovar arquivo'], 500);
        }
    }

    public function reject(Request $request, $id)
    {
        try {
            $file = DocumentoNucleo::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado para rejeição: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            $file->status = 'Rejeitado Coordenador';
            $file->ativo = false;
            $file->save();

            StatusDocumento::create([
                'documento_id' => $file->id,
                'id_usuario'   => Auth::id(),
                'acao'         => 'rejeitado',
                'descricao'    => $request->input('descricao'),
            ]);

            return response()->json(['message' => 'Documento rejeitado com sucesso']);
        } catch (\Exception $e) {
            Log::error('Erro ao rejeitar arquivo: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao rejeitar arquivo'], 500);
        }
    }

    public function approveGeral(Request $request, $id)
    {
        try {
            $file = DocumentoNucleo::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado para aprovação geral: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            $file->status = 'Aprovado Coordenador Geral';
            $file->save();

            StatusDocumento::create([
                'documento_id' => $file->id,
                'id_usuario'   => Auth::id(),
                'acao'         => 'aprovado',
                'descricao'    => $request->input('descricao'),
            ]);

            return response()->json(['message' => 'Documento aprovado pelo coordenador geral com sucesso']);
        } catch (\Exception $e) {
            Log::error('Erro ao aprovar arquivo pelo coordenador geral: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao aprovar arquivo'], 500);
        }
    }

    public function rejectGeral(Request $request, $id)
    {
        try {
            $file = DocumentoNucleo::find($id);

            if (!$file) {
                Log::error('Arquivo não encontrado para rejeição geral: ' . $id);
                return response()->json(['error' => 'Arquivo não encontrado'], 404);
            }

            $file->status = 'Rejeitado Coordenador Geral';
            $file->ativo = false;
            $file->save();

            StatusDocumento::create([
                'documento_id' => $file->id,
                'id_usuario'   => Auth::id(),
                'acao'         => 'rejeitado',
                'descricao'    => $request->input('descricao'),
            ]);

            return response()->json(['message' => 'Documento rejeitado pelo coordenador geral com sucesso']);
        } catch (\Exception $e) {
            Log::error('Erro ao rejeitar arquivo pelo coordenador geral: ' . $e->getMessage());
            return response()->json(['error' => 'Erro ao rejeitar arquivo'], 500);
        }
    }

    public function getUserRole(Request $request)
    {
        $user = Auth::user();
        $role = $user->roles()->pluck('slug')->first();

        return response()->json(['role' => $role]);
    }
}
