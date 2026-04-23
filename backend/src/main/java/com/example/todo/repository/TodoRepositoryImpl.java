package com.example.todo.repository;

import com.example.todo.entity.Priority;
import com.example.todo.entity.QTodo;
import com.example.todo.entity.Todo;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TodoRepositoryImpl implements TodoRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public TodoRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<Todo> findAllByFilters(String username, String keyword, Boolean completed, Priority priority, Pageable pageable) {
        QTodo todo = QTodo.todo;

//        조회
        List<Todo> content = queryFactory
                .selectFrom(todo)
                .where(
                        todo.user.username.eq(username),
                        containsKeyword(keyword),
                        eqCompleted(completed),
                        eqPriority(priority)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(todo.createdAt.desc())
                .fetch();

//        카운트
        JPAQuery<Long> countQuery = queryFactory
                .select(todo.count())
                .from(todo)
                .where(
                        todo.user.username.eq(username),
                        containsKeyword(keyword),
                        eqCompleted(completed),
                        eqPriority(priority)
                );
        return PageableExecutionUtils.getPage(content, pageable, countQuery::fetchOne);
    }

    private BooleanExpression containsKeyword(String keyword) {
        return (keyword != null && !keyword.isBlank()) ? QTodo.todo.title.containsIgnoreCase(keyword) : null;
    }
    private BooleanExpression eqCompleted(Boolean completed) {
        return (completed != null) ? QTodo.todo.completed.eq(completed) : null;
    }
    private BooleanExpression eqPriority(Priority priority) {
        return (priority != null) ? QTodo.todo.priority.eq(priority) : null;
    }
}
