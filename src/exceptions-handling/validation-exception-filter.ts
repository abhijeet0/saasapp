import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { CustomMessages } from '../utils/custom-messages';
import { Response } from '../utils/response';
import { StatusCodes } from '../utils/status-codes';
const fs = require("fs");
@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {

  addExceptionToFile = async (dataObj) =>{
    const headers = Object.keys(dataObj);
    const fileExists = fs.existsSync(process.env.EXCEPTION_FILE_PATH);
    if (!fileExists || fs.readFileSync(process.env.EXCEPTION_FILE_PATH).length === 0) {
      const csvData = `${headers.join(',')}\n${headers.map(header => dataObj[header]).join(',')}`;
      await fs.promises.writeFile(process.env.EXCEPTION_FILE_PATH, `${csvData}`);
    } else {
      const csvData = `${headers.map(header => dataObj[header]).join(',')}`;
      await fs.promises.appendFile(process.env.EXCEPTION_FILE_PATH, `\n${csvData}`);
    }
  }
  async catch(exception: HttpException, host: ArgumentsHost) {
  
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let dataObj = {};
    dataObj['status_code'] = exception.getStatus();
    dataObj['exception'] = exception.getResponse()['message'];
    dataObj['api'] = ctx['args'][0]['url'];

    await this.addExceptionToFile(dataObj);

    if (exception instanceof HttpException && exception.getStatus() === StatusCodes.BAD_REQUEST) {

      let message = exception.getResponse()['message'].length > 1 ? exception.getResponse()['message'][0] : (exception.getResponse()['message']).toString();
      response.json(new Response(false, StatusCodes.BAD_REQUEST,message, {}));

    } else {
      response.json(new Response(false, StatusCodes.INTERNAL_SERVER_ERROR, CustomMessages.INTERNAL_SERVER_ERROR, {}));
    }
  }
  
}
