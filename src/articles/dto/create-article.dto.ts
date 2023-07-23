import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty({ required: true, default: false })
  published?: boolean = false;
}
