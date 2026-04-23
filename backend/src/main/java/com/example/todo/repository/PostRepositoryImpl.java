package com.example.todo.repository;

import com.example.todo.dto.post.PostSearchCondition;
import com.example.todo.entity.Post;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import org.springframework.util.StringUtils;
import java.util.List;

import static com.example.todo.entity.QPost.post;

public class PostRepositoryImpl implements PostRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    public PostRepositoryImpl(EntityManager entityManager) {
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @Override
    public Page<Post> search(PostSearchCondition condition, Pageable pageable) {
        List<Post> content = queryFactory
                .selectFrom(post)
                .where(
                        titleContains(condition.getTitle()),
                        contentContains(condition.getContent()),
                        authorNameEq(condition.getAuthorName())
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(post.createdAt.desc())
                .fetch();

        long total = queryFactory
                .select(post.count())
                .from(post)
                .where(
                        titleContains(condition.getTitle()),
                        contentContains(condition.getContent()),
                        authorNameEq(condition.getAuthorName())
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total);
    }

    private BooleanExpression titleContains(String title) {
        return StringUtils.hasText(title) ? post.title.contains(title) : null;
    }

    private BooleanExpression contentContains(String content) {
        return StringUtils.hasText(content) ? post.content.contains(content) : null;
    }

    private BooleanExpression authorNameEq(String authorName) {
        return StringUtils.hasText(authorName) ? post.author.username.eq(authorName) : null;
    }
}
