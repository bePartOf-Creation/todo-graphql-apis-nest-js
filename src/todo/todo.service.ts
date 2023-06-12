import { Injectable } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodoService {

constructor(private prisma: PrismaService) {}

 async create(createTodoInput: CreateTodoInput) {

  return await this.prisma.todo.create({
        data: createTodoInput
    });
  }

  async findAll() {
    return await this.prisma.todo.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.todo.findUnique({
       where: { id } 
      });
  }

  async findTodoByTitleOrDescription(title: string, description: string): Promise<Todo[]> {
    const where = {};
    if (title) {
      where['title'] = { contains: title };
    }
    if (description) {
      where['description'] = { contains: description };
    }
    return this.prisma.todo.findMany({ where });
  }

}
