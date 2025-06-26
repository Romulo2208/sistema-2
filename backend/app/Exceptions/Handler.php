<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Database\QueryException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        $this->renderable(function (UnauthorizedHttpException $e, $request) {

            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getStatusCode());

        });

        
        $this->renderable(function (JWTException $e, $request) {

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);

        });


        $this->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->is('api/*')) :
                return response()->json([
                    'error' => trans('messages.notFound')
                ], 404);
               
            endif;
        });

        
               
        $this->renderable(function (QueryException $e, $request) {
            if ($request->is('api/*')) :
                return response()->json([
                    'error' =>  $e->getMessage()
                ], 500);
               
            endif;
        });
        


    }

   
    


}