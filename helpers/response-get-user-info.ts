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
        example: '[admin]',
        description: 'non uniq role',
    })
    roles: [string];

    @ApiProperty({
        example: 'kdjfht75525hkE8HGS.jpg',
        description: 'non uniq file',
    })
    file: string;
  }

  return UserInfo
}