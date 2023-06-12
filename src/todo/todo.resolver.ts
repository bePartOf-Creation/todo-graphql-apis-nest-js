import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoInput } from './dto/create-todo.input';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { query } from 'express';
import { QueryTodoInput } from './dto/query-todo.input';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  createTodo(@Args('createTodoInput') createTodoInput: CreateTodoInput) {
    try {
      return this.todoService.create(createTodoInput);
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException('Failed to create todo', error.message);
    }
  }

  @Query(() => [Todo], { name: 'todos' })
  findAll() {
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    try {
      return this.todoService.findOne(id);
    } catch (error) {
      throw new NotFoundException('Unable to find todo :', error.message);
    }
  }


  @Query(() => [Todo], { name: 'findtodos' })
  findTodoByTitleOrDescription(
    @Args('queryTodo') queryTodo: QueryTodoInput): Promise<Todo[]> {
      try {
         if(!queryTodo.title && !queryTodo.description){
           throw new BadRequestException("No parameters was passed to find")
         } 

        return this.todoService.findTodoByTitleOrDescription(queryTodo.title , queryTodo.description);
      } catch (error) {
        throw new NotFoundException('Unable to find todo :', error.message);
      }
    
  }
}
