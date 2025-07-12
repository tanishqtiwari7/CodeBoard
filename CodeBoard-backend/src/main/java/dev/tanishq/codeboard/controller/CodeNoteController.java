package dev.tanishq.codeboard.controller;

import dev.tanishq.codeboard.model.CodeNote;
import dev.tanishq.codeboard.model.NoteTag;
import dev.tanishq.codeboard.repository.CodeNoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/codenotes")
@CrossOrigin(origins = "*")
public class CodeNoteController {
    
    @Autowired
    private CodeNoteRepository repository;
    
    @GetMapping
    public List<CodeNote> getAllNotes() {
        return repository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CodeNote> getNoteById(@PathVariable Long id) {
        Optional<CodeNote> note = repository.findById(id);
        return note.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public CodeNote createNote(@RequestBody CodeNote note) {
        return repository.save(note);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CodeNote> updateNote(@PathVariable Long id, @RequestBody CodeNote noteDetails) {
        Optional<CodeNote> optionalNote = repository.findById(id);
        if (optionalNote.isPresent()) {
            CodeNote note = optionalNote.get();
            note.setTitle(noteDetails.getTitle());
            note.setDescription(noteDetails.getDescription());
            note.setContent(noteDetails.getContent());
            note.setTags(noteDetails.getTags());
            return ResponseEntity.ok(repository.save(note));
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public List<CodeNote> searchNotes(@RequestParam String query) {
        return repository.searchNotes(query);
    }
    
    @GetMapping("/tags")
    public List<NoteTag> getAllTags() {
        return repository.findAllTags()
                .stream()
                .map(NoteTag::new)
                .collect(Collectors.toList());
    }
    
    @PostMapping("/{id}/increment-view")
    public ResponseEntity<?> incrementViewCount(@PathVariable Long id) {
        Optional<CodeNote> optionalNote = repository.findById(id);
        if (optionalNote.isPresent()) {
            CodeNote note = optionalNote.get();
            note.setViewCount(note.getViewCount() + 1);
            repository.save(note);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
