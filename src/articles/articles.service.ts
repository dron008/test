import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  // eslint-disable-next-line prettier/prettier

  constructor(private prisma: PrismaService) {}

  create(createArticleDto: CreateArticleDto) {
    // return 'This action adds a new article';
    return this.prisma.article.create({ data: createArticleDto });
  }

  findAll() {
    // return;
    return this.prisma.article.findMany({});
    // return `This action returns all articles`;
  }

  findOne(id: number) {
    // return `This action returns a #${id} article`;
    return this.prisma.article.findUnique({ where: { id } });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    // return `This action updates a #${id} article`;
    return this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  remove(id: number) {
    return this.prisma.article.delete({
      where: { id },
    });
  }

  findDrafts() {
    return this.prisma.article.findMany({ where: { published: true } });
  }
}
