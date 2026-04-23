package com.example.todo.dto.common;

import org.springframework.data.domain.Page;

import java.util.List;

public class PageResponse<T>{
    private List<T> data;
    private int page;
    private int size;
    private Long totalElements;
    private int totalPages;

    public PageResponse(Page<T> page) {
        this.data = page.getContent();
        this.page = page.getNumber();
        this.size = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
    }

    public List<T> getData() {
        return data;
    }

    public int getPage() {
        return page;
    }

    public int getSize() {
        return size;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }
}
