package br.com.example.todolist.controller;

import br.com.example.todolist.model.Task;
import br.com.example.todolist.repositories.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    private record TaskDTO (String content) {
    }

    private record EditTaskDTO (String uuid, String content) {
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody TaskDTO req) {
        Task newTask = new Task();
        newTask.setContent(req.content);
        Task savedTask = taskRepository.save(newTask);
        return ResponseEntity.status(HttpStatus.OK).body(savedTask);
    }

    @GetMapping
    public ResponseEntity<?> findAll() {
        List<Task> listTask = taskRepository.findAll();
        return ResponseEntity.status(HttpStatus.OK).body(listTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        Optional<Task> taskOptional = taskRepository.findById(UUID.fromString(id));
        if (taskOptional.isPresent()) {
            taskRepository.deleteById(UUID.fromString(id));
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody EditTaskDTO req) {
        Optional<Task> taskOptional = taskRepository.findById(UUID.fromString(id));
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            task.setContent(req.content);
            Task updatedTask = taskRepository.save(task);
            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");
        }
    }
}
