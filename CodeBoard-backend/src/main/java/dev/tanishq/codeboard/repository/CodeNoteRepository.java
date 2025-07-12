package dev.tanishq.codeboard.repository;

import dev.tanishq.codeboard.model.CodeNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface CodeNoteRepository extends JpaRepository<CodeNote, Long> {
    
    @Query("SELECT DISTINCT tag FROM CodeNote n JOIN n.tags tag")
    List<String> findAllTags();
    
    @Query("SELECT n FROM CodeNote n WHERE " +
           "LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(n.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CodeNote> searchNotes(@Param("query") String query);
}
