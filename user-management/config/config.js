const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.APP_RUNTIME_ENV;

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'user-management',
      http_status_codes: {
        http_200_ok: process.env.HTTP_200_OK || 200,
        http_201_created: process.env.HTTP_201_CREATED || 201,
        http_400_bad_request: process.env.HTTP_400_BAD_REQUEST || 400,
        http_401_unauthorized: process.env.HTTP_401_UNAUTHORIZED || 401,
        http_403_forbidden: process.env.HTTP_403_FORBIDDEN || 403,
        http_404_not_found: process.env.HTTP_404_NOT_FOUND || 404,
        http_500_internal_server_error: process.env.HTTP_500_INTERNAL_SERVER_ERROR || 500,
      },
      rest_error_codes: {
        object_not_found: process.env.OBJECT_NOT_FOUND || 'ObjectNotFound',
        not_null: process.env.NOT_NULL || 'NotNull',
        invalid_argument: process.env.INVALID_ARGUMENT || 'InvalidArgument',
        invalid_state: process.env.INVALID_STATE || 'InvalidState',
        type_mismatch: process.env.TYPE_MISMATCH || 'TypeMismatch',
        missing_id: process.env.MISSING_ID || 'MissingId',
        data_integrity_violation: process.env.DATA_INTEGRITY_VIOLATION || 'DataIntegrityViolationException',
        invalid_file_format: process.env.INVALID_FILE_FORMAT || 'InvalidFileFormat',
        invalid_error: process.env.INVALID_ERROR || 'InvalidError',
        object_cannot_be_saved: process.env.OBJECT_CANNOT_BE_SAVED || 'ObjectCannotBeSaved',
        authentication_error: process.env.AUTH_ERROR || 'AuthenticationError',
        insufficient_permissions: process.env.INSUFFICIENT_PERMISSION || 'InsufficientPermissions',
        system_error: process.env.SYSTEM_ERROR || 'SystemError',
        uniqueness_violation_error: process.env.UNIQUENESS_VIOLATION_ERROR || 'UniquenessViolationError'
      },
      database_error_codes: {
        err_level_query_exec: process.env.ERR_LVL_QRY_EXEC || 'QueryExecutionError',
        rest_error_code_fetch: process.env.REST_ERR_CODE_FETCH || 'ObjectNotFound',
        rest_error_code_insert: process.env.REST_ERR_CODE_INSERT || 'ObjectCannotBeSaved',
        rest_error_code_update: process.env.REST_ERR_CODE_UPDATE || 'ObjectCannotBeUpdated',
        rest_error_code_delete: process.env.REST_ERR_CODE_DELETE || 'ObjectCannotBeDeleted',
      },
      universal_regex: {
        username: /^[a-z][a-z0-9]+$/i,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%&*])[A-Za-z\d!@$%&*]+$/i
      }
    },
    port: process.env.APP_PORT,
    db: `${process.env.DB_DRIVER}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  },
  production: {
    root: rootPath,
    app: {
      name: 'user-management',
      http_status_codes: {
        http_200_ok: process.env.HTTP_200_OK || 200,
        http_201_created: process.env.HTTP_201_CREATED || 201,
        http_400_bad_request: process.env.HTTP_400_BAD_REQUEST || 400,
        http_401_unauthorized: process.env.HTTP_401_UNAUTHORIZED || 401,
        http_403_forbidden: process.env.HTTP_403_FORBIDDEN || 403,
        http_404_not_found: process.env.HTTP_404_NOT_FOUND || 404,
        http_500_internal_server_error: process.env.HTTP_500_INTERNAL_SERVER_ERROR || 500,
      },
      rest_error_codes: {
        object_not_found: process.env.OBJECT_NOT_FOUND || 'ObjectNotFound',
        not_null: process.env.NOT_NULL || 'NotNull',
        invalid_argument: process.env.INVALID_ARGUMENT || 'InvalidArgument',
        invalid_state: process.env.INVALID_STATE || 'InvalidState',
        type_mismatch: process.env.TYPE_MISMATCH || 'TypeMismatch',
        missing_id: process.env.MISSING_ID || 'MissingId',
        data_integrity_violation: process.env.DATA_INTEGRITY_VIOLATION || 'DataIntegrityViolationException',
        invalid_file_format: process.env.INVALID_FILE_FORMAT || 'InvalidFileFormat',
        invalid_error: process.env.INVALID_ERROR || 'InvalidError',
        object_cannot_be_saved: process.env.OBJECT_CANNOT_BE_SAVED || 'ObjectCannotBeSaved',
        authentication_error: process.env.AUTH_ERROR || 'AuthenticationError',
        insufficient_permissions: process.env.INSUFFICIENT_PERMISSION || 'InsufficientPermissions',
        system_error: process.env.SYSTEM_ERROR || 'SystemError',
        uniqueness_violation_error: process.env.UNIQUENESS_VIOLATION_ERROR || 'UniquenessViolationError'
      },
      database_error_codes: {
        err_level_query_exec: process.env.ERR_LVL_QRY_EXEC || 'QueryExecutionError',
        rest_error_code_fetch: process.env.REST_ERR_CODE_FETCH || 'ObjectNotFound',
        rest_error_code_insert: process.env.REST_ERR_CODE_INSERT || 'ObjectCannotBeSaved',
        rest_error_code_update: process.env.REST_ERR_CODE_UPDATE || 'ObjectCannotBeUpdated',
        rest_error_code_delete: process.env.REST_ERR_CODE_DELETE || 'ObjectCannotBeDeleted',
      }
    },
    port: process.env.APP_PORT,
    db: `${process.env.DB_DRIVER}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  }
};

module.exports = config[env];
