import { ApiProperty } from "@nestjs/swagger"

export function createResponseUserInfo(baseClass){
  class UserInfo extends baseClass {
    @ApiProperty({
        example: '2023-02-24T21:04:36.879Z',
        description: 'non uniq date',
    })
    createdAt: string;

    @ApiProperty({
        example: '2023-02-24T21:04:36.879Z',
        description: 'non uniq date',
      })
    updatedAt: string;

    @ApiProperty({
        example: '{ "id": "5dfacf35-8ef3-4a4d-a40b-1627734142cb", "role": "SuperAdmin", "description": "Create and assign admin roles" }',
        description: 'non uniq role',
    })
    role: {};

    @ApiProperty({
        example: 'kdjfht75525hkE8HGS.jpg',
        description: 'non uniq file',
    })
    file: string;
  }

  return UserInfo
}