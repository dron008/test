// import { Injectable } from '@nestjs/common';

// import PrismaClient from '@prisma/client';
// @Injectable()
// export class PrismaService extends PrismaClient { }

// src/prisma/prisma.service.ts

import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// eslint-disable-next-line prettier/prettier
export class PrismaService extends PrismaClient { }