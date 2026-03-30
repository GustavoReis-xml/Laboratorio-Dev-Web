import { useBooks } from "../context/BooksContext";
import { MenuItem, Select, Typography, Box, Card, CardContent } from "@mui/material";
import { useState } from "react";

export default function CourseFilter() {
  const { books } = useBooks();
  
  // Criamos dois estados separados para controlar os filtros
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  // Extraímos os valores únicos do JSON
  const courses = [...new Set(books.map(book => book.course))];
  // Pegamos os semestres únicos e já ordenamos do 1º ao 6º
  const semesters = [...new Set(books.map(book => book.semester))].sort((a, b) => a - b);

  // A mágica acontece aqui: o livro só passa se bater com o curso E com o semestre escolhidos
  const filteredBooks = books.filter(b => {
    const matchCourse = selectedCourse === "" || b.course === selectedCourse;
    // Transformamos o número do semestre em string para comparar com o valor do Select
    const matchSemester = selectedSemester === "" || b.semester.toString() === selectedSemester;
    return matchCourse && matchSemester;
  });

  return (
    <>
      <Typography variant="h5" gutterBottom>Filtrar Referências</Typography>

      {/* Usamos o Box do Material UI para colocar os filtros lado a lado */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="subtitle2">Disciplina</Typography>
          <Select 
            value={selectedCourse} 
            onChange={e => setSelectedCourse(e.target.value)} 
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todas as Disciplinas</MenuItem>
            {courses.map(course => (
              <MenuItem key={course} value={course}>{course}</MenuItem>
            ))}
          </Select>
        </Box>

        <Box>
          <Typography variant="subtitle2">Semestre</Typography>
          <Select 
            value={selectedSemester} 
            onChange={e => setSelectedSemester(e.target.value)} 
            displayEmpty
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Todos os Semestres</MenuItem>
            {semesters.map(semester => (
              <MenuItem key={semester} value={semester.toString()}>{semester}º Semestre</MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Renderizamos os livros em formato de Card para manter o padrão */}
      {filteredBooks.map((book, idx) => (
        <Card key={idx} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">{book.title}</Typography>
            <Typography variant="body2">
              {book.author} - {book.publisher} ({book.year}) | Semestre: {book.semester} | Disciplina: {book.course}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
}