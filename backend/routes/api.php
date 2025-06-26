<?php

use App\Http\Controllers\DocumentoNucleoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NucleoController;
use App\Http\Controllers\MonitorController;
use App\Http\Controllers\MunicipioController;
use App\Http\Controllers\DeficienciaController;
use App\Http\Controllers\BeneficiarioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ModuleController;
use App\Http\Controllers\DiaTurnoController;
use App\Http\Controllers\EscolaController;
use App\Http\Controllers\ComarController;
use App\Http\Controllers\FileController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::get('certificado', function(){
    return redirect(env('APP_URL_LOGIN_FRONT'));
});

// Route::post('/upload', [FileController::class, 'upload'])->name('files.upload');
// Route::get('/files', [FileController::class, 'index'])->name('files.index');
// Route::post('/files', [FileController::class, 'store'])->name('files.store');
// Route::put('/files/{id}', [FileController::class, 'update'])->name('files.update');
// Route::delete('/files/{id}', [FileController::class, 'destroy'])->name('files.destroy');
// Route::get('/download/{path}', [FileController::class, 'download'])->where('path', '.*')->name('files.download');


Route::post('login', [AuthController::class, 'authenticate']);

Route::apiResource('users', UserController::class)->middleware(['jwt.auth', 'role:admin|coordenador_geral']);
Route::delete('/users_bath', [UserController::class,'destroyBath'])->middleware(['jwt.auth', 'role:admin|coordenador_geral']);
Route::apiResource('roles', RoleController::class)->middleware(['jwt.auth', 'role:admin|coordenador_geral']);
Route::apiResource('modules', ModuleController::class)->middleware(['jwt.auth', 'role:admin|coordenador_geral']);

Route::apiResource('comars', ComarController::class);

Route::apiResource('permissions',   PermissionController::class,          [ 'middleware' => 'jwt.auth', 'middleware' => 'role:admin']);


Route::group(['prefix'=>'roles', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin'], function () {
    Route::get('/getPermissions/{id}' , [RoleController::class, 'getPermissions']);
});

Route::group(['prefix'=>'permissions', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin'], function () {
    Route::post('/sync-permissions-role' , [PermissionController::class, 'syncPermissionsRole']);
});


Route::group(['prefix'=>'modules', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin'], function () {
    Route::get('/getRoles/{id}' , [ModuleController::class, 'getRoles']);
    Route::post('/sync-role' , [ModuleController::class, 'syncRoles']);
});


Route::group(['prefix'=>'monitors', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin'], function () {
    Route::post('/upload-file'              , [MonitorController::class, 'uploadFile']);
    Route::get('/getFiles/{id}'             , [MonitorController::class, 'getFiles']);
    Route::get('deleteFile/{file}/{id}'     , [MonitorController::class, 'deleteFile']);
    Route::get('downloadFile/{file}/{id}'   , [MonitorController::class, 'downloadFile']);
});

Route::apiResource('nucleos', NucleoController::class,        [ 'middleware' => 'jwt.auth', 'middleware' => 'role:admin|coordenador_geral|coordenador_nucleo|gestor_regional']);
Route::apiResource('monitors', MonitorController::class,      [ 'middleware' => 'jwt.auth', 'middleware' => 'role:admin|coordenador_geral|coordenador_nucleo|gestor_regional']);
Route::delete('/monitors_bath', [MonitorController::class,'destroyBath'])->middleware(['jwt.auth', 'role:admin|coordenador_geral|coordenador_nucleo|gestor_regional']);
Route::apiResource('escolas', EscolaController::class,        [ 'middleware' => 'jwt.auth', 'middleware' => 'role:admin|coordenador_geral|coordenador_nucleo|gestor_regional']);


Route::group(['prefix'=>'beneficiarios', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin|coordenador_geral|gestor_regional|coordenador_nucleo'], function () {
    Route::post('/upload-file'              , [BeneficiarioController::class, 'uploadFile']);
    Route::get('/getFiles/{id}'             , [BeneficiarioController::class, 'getFiles']);
    Route::get('deleteFile/{file}/{id}'     , [BeneficiarioController::class, 'deleteFile']);
    Route::get('downloadFile/{tipo}/{id}/{arquivo}'   , [BeneficiarioController::class, 'downloadFile']);
    Route::get('pjp/{id}'   , [BeneficiarioController::class, 'pjpsUsuario']);
    Route::post('upload-avatar'              , [BeneficiarioController::class, 'uploadAvatar']);
    Route::get('getAvatar/{id}'             , [BeneficiarioController::class, 'getAvatar']);

    Route::patch('desativar/{beneficiario}',[BeneficiarioController::class, 'desativar']);
    Route::patch('reativar/{beneficiario}',[BeneficiarioController::class, 'reativar']);
    Route::patch('desativarBath',[BeneficiarioController::class, 'desativarBath']);

});

Route::apiResource('beneficiarios',  BeneficiarioController::class)->middleware(['jwt.auth']);


Route::put('beneficiarios/{beneficiario}/endereco',[BeneficiarioController::class,'updateEndereco'])->middleware(['jwt.auth']);
Route::put('beneficiarios/{beneficiario}/uniforme',[BeneficiarioController::class,'updateUniforme'])->middleware(['jwt.auth']);

Route::get('municipios', [MunicipioController::class, 'index']); //Usa query string: Ex: ...api/municipios?regiao=Sul&uf=SC
Route::get('regioes', [MunicipioController::class, 'getRegioes']);
Route::get('ufs', [MunicipioController::class, 'getUfs']); //Usa query string: Ex: ...api/ufs?regiao=Sul

//Route::get('deficiencias', [DeficienciaController::class, 'index']);
Route::apiResource('deficiencias',       DeficienciaController::class,        [ 'middleware' => 'jwt.auth', 'middleware' => 'role:admin|coordenador_geral|coordenador_nucleo|gestor_regional']);
Route::get('diaTurno', [DiaTurnoController::class, 'index']);

Route::get('dashboard/beneficiarios', [DashboardController::class, 'index']);
Route::get('dashboard/beneficiarios-acesso', [DashboardController::class, 'getBeneficiariosByAccess'])->middleware(['jwt.auth']);
Route::get('dashboard/nucleos', [DashboardController::class, 'getNucleosMapQtd']);

Route::group(['prefix'=>'user', 'middleware' => 'jwt.auth', 'middleware' => 'role:admin'], function () {
    Route::get('teste-user', function () {
        return "Rota teste user protegida!";
    });
});



//teste com rota fechada com jwt
Route::group(['middleware' => ['jwt.auth']], function() {
    Route::get('teste1', function () {
        return "TESTE 1 ! ";
    });
});

//teste com rota aberta sem jwt
Route::get('teste2', function () {
    return "TESTE 2 ! ";
});


//rota captura de dados no LDAP
Route::get('userLdap/{cpf}', [UserController::class, 'getUserLdap']);

Route::middleware('auth:api')->group(function () {
    Route::post('/upload', [FileController::class, 'upload'])->name('files.upload');
    Route::get('/files', [FileController::class, 'index'])->name('files.index');
    Route::post('/files', [FileController::class, 'store'])->name('files.store');
    Route::put('/files/{id}', [FileController::class, 'update'])->name('files.update');
    Route::delete('/files/{id}', [FileController::class, 'destroy'])->name('files.destroy');
    Route::get('/download/{path}', [FileController::class, 'download'])->where('path', '.*')->name('files.download');
    Route::get('/user/role', [FileController::class, 'getUserRole'])->name('user.role');
});

Route::prefix('nucleo')->group(function () {
    Route::post('/upload', [DocumentoNucleoController::class, 'upload'])->name('nucleo-documentos.upload');
    Route::get('/files', [DocumentoNucleoController::class, 'index'])->name('nucleo-documentos.index');
    Route::post('/files', [DocumentoNucleoController::class, 'store'])->name('nucleo-documentos.store');
    Route::put('/files/{id}', [DocumentoNucleoController::class, 'update'])->name('nucleo-documentos.update');
    Route::delete('/files/{id}', [DocumentoNucleoController::class, 'destroy'])->name('nucleo-documentos.destroy');
    Route::patch('/files/{id}/approve', [DocumentoNucleoController::class, 'approve'])->name('nucleo-documentos.approve');
    Route::patch('/files/{id}/reject', [DocumentoNucleoController::class, 'reject'])->name('nucleo-documentos.reject');
    Route::patch('/files/{id}/approve-geral', [DocumentoNucleoController::class, 'approveGeral'])->name('nucleo-documentos.approve-geral');
    Route::patch('/files/{id}/reject-geral', [DocumentoNucleoController::class, 'rejectGeral'])->name('nucleo-documentos.reject-geral');
    Route::get('/download/{path}', [DocumentoNucleoController::class, 'download'])->where('path', '.*')->name('nucleo-documentos.download');
    Route::get('/user/role', [FileController::class, 'getUserRole'])->name('nucleo.user.role');
});
