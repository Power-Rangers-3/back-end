import { ApiProperty } from "@nestjs/swagger";

export class Token {
  @ApiProperty({example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlVTRVIxQGdtYWlsLmNvbSIsImlkIjo3LCJyb2xlcyI6W3siaWQiOjIsInZhbHVlIjoiVVNFUiIsImRlc2NyaXB0aW9uIjoic3RvY2sgdXNlciIsImNyZWF0ZWRBdCI6IjIwMjItMTItMjNUMTE6MTk6MjIuMzU0WiIsInVwZGF0ZWRBdCI6IjIwMjItMTItMjNUMTE6MTk6MjIuMzU0WiJ9XSwiaWF0IjoxNjcxNzk3NzgwLCJleHAiOjE2NzE4ODQxODB9.jtNR6Ik8yLbWD8TrfMr05nQ1l_K6qu3UaWZFEuy9cnQ', description: 'JWT token that creating while responce'})
  readonly value: string;
}
