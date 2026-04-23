package com.example.todo.scheduler;

import org.springframework.batch.core.job.Job;
import org.springframework.batch.core.job.parameters.JobParameters;
import org.springframework.batch.core.job.parameters.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class BatchScheduler {

    private final JobLauncher jobLauncher;
    private final Job deactivateOldPostsJob;

    public BatchScheduler(JobLauncher jobLauncher, Job deactivateOldPostsJob) {
        this.jobLauncher = jobLauncher;
        this.deactivateOldPostsJob = deactivateOldPostsJob;
    }


    //    매일 새벽 2시 스케줄러
    @Scheduled(cron = "0 0/1 * * * *")
    public void runDeactiveOldPostsJob() {
        try{
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLocalDateTime("runTime", LocalDateTime.now())
                    .toJobParameters();

            jobLauncher.run(deactivateOldPostsJob, jobParameters);

            System.out.println("스케줄러 성공");

        }catch(Exception e){
            System.out.println("스케줄러 실패: " + e.getMessage());
        }
    }

}
