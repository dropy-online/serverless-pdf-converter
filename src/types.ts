export enum AvailableType {
  pdf = 'pdf',
}

export enum AvailableOutputType {
  jpg = 'jpg',
  png = 'png',
}

export enum RequestErrors {
  UNDIFINED_REQUEST_BODY = 'UNDIFINED_REQUEST_BODY',
  UNDEFINED_FILE_TYPE = 'UNDEFINED_FILE_TYPE',
  UNSUPPORTED_FILE_TYPE = 'UNSUPPORTED_FILE_TYPE',
  UNDEFINED_OUTPUT_PATH ='UNDEFINED_OUTPUT_PATH',
  UNSUPPORT_OUTPUT_TYPE='UNSUPPORT_OUTPUT_TYPE'
}

export enum S3Errors {
  FAILED_S3_GET_OBJECT = 'FAILED_S3_GET_OBJECT',
  FAILED_S3_PUT_OBJECT = 'FAILED_S3_PUT_OBJECT',
  FAILED_S3_DELETE_OBJECT = 'FAILED_S3_DELETE_OBJECT',
}

export type Error = {
  status:'error',
  error: RequestErrors | S3Errors
}

export type APIResponse = {
  headers: { [key: string]: string | boolean | number };
  statusCode: number;
  body: string;
};
