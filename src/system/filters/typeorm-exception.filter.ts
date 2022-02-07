import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
    catch(exception: TypeORMError, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();
        let message: string = (exception as TypeORMError).message;
        let code: number = (exception as any).code;
        const errorResponse = {
            status: 500,
            errors: [{ code: code, message: message }],
            timestamp: new Date().toISOString()
        };

        response.status(errorResponse.status).json(errorResponse);
    }
}
