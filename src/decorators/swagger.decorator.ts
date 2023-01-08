import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

export function SwaggerDecorator(
  apiTags: string,
  apiOperation: string,
  apiResponseBadRequest: { status: number; description: string },
  apiResponse: { status: number; description: string },
  apiHeader: { name: string; description: string },
) {
  return applyDecorators(
    ApiTags(apiTags),
    ApiOperation({ summary: apiOperation }),
    ApiResponse({
      status: apiResponseBadRequest.status,
      description: apiResponseBadRequest.description,
    }),
    ApiResponse({
      status: apiResponse.status,
      description: apiResponse.description,
    }),
    ApiHeader({
      name: apiHeader.name,
      description: apiHeader.description,
    }),
  );
}
