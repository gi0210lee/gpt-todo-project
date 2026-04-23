package com.example.todo.config;

import com.example.todo.entity.Post;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.batch.core.configuration.JobRegistry;
import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.Step;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.infrastructure.item.ItemProcessor;
import org.springframework.batch.infrastructure.item.database.JpaItemWriter;
import org.springframework.batch.infrastructure.item.database.JpaPagingItemReader;
import org.springframework.batch.infrastructure.item.database.builder.JpaItemWriterBuilder;
import org.springframework.batch.infrastructure.item.database.builder.JpaPagingItemReaderBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

import java.time.LocalDateTime;
import java.util.Map;

@Configuration
public class BatchConfig {

    private final EntityManagerFactory entityManagerFactory;

    public BatchConfig(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

//    배치 작업 정의
    @Bean
    public Job deactivateOldPostsJob(JobRepository jobRepository, Step deactiveOldPostsStep) {
        Job job = new JobBuilder("deactivateOldPostsJob", jobRepository)
                .start(deactiveOldPostsStep)
                .build();

        return job;
    }

//    배치 세부 단계 정의
    @Bean
    public Step deactiveOldPostsStep(JobRepository jobRepository, PlatformTransactionManager transactionManager) {
        return new StepBuilder("deactiveOldPostsStep", jobRepository)
                .<Post, Post>chunk(10)
                .reader(postReader())
                .processor(postProcessor())
                .writer(postWriter())
                .transactionManager(transactionManager)
                .build();
    }

    @Bean
    public JpaPagingItemReader<Post> postReader() {
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);

        return new JpaPagingItemReaderBuilder<Post>()
                .name("postReader")
                .entityManagerFactory(entityManagerFactory)
                .queryString("SELECT p FROM Post p WHERE p.active = true AND p.createdAt < :sixMonthsAgo")
                .parameterValues(Map.of("sixMonthsAgo", sixMonthsAgo))
                .pageSize(10)
                .build();
    }

    @Bean
    public ItemProcessor<Post, Post> postProcessor() {
        return post -> {
            post.setActive(false);
            return post;
        };
    }

    @Bean
    public JpaItemWriter<Post> postWriter() {
        return new JpaItemWriterBuilder<Post>()
                .entityManagerFactory(entityManagerFactory)
                .build();
    }

}
