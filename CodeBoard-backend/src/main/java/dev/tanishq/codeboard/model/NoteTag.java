package dev.tanishq.codeboard.model;

public class NoteTag {
    private String name;
    
    public NoteTag() {}
    
    public NoteTag(String name) {
        this.name = name;
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
