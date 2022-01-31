<?php
    class AlumnoDAO extends Model implements CRUD {
        public function __construct()
        {
            parent::__construct();
        }

        public function insert($data)
        {
            $query = $this->db->conectar()->prepare('INSERT INTO alumno values (:matricula, :nombre, :apellidos)');
            $query->execute([':matricula' => $data['matricula'],':nombre' => $data['nombre'],':apellidos' => $data['apellido']]);
            echo 'ok';
        }

        public function update($data)
        {
            $query = $this->db->conectar()->prepare('UPDATE alumno SET  nombre = :nombre, apellido = :apellidos WHERE matricula = :matricula');
            $query->execute([':matricula' => $data['matricula'],':nombre' => $data['nombre'],':apellidos' => $data['apellido']]);
            echo 'ok';
        }

        public function delete($id)
        {
            $query = $this->db->conectar()->prepare('DELETE FROM alumno where matricula = :matricula');
            $query->execute([':matricula' => $id]);
            echo 'ok';
        }

        public function read()
        {
            require_once 'alumnoDTO.php';
            $query = "SELECT * FROM alumno";
            $objAlumnos = array();
            foreach ($this->db->consultar($query) as $key => $value) {
                $alumno = new AlumnoDTO();
                $alumno->idAlumno = $value['matricula'];
                $alumno->nombre = $value['nombre'];
                $alumno->apellido = $value['apellido'];
                $objAlumnos['data'][] = $alumno;
            }
            echo json_encode($objAlumnos, JSON_UNESCAPED_UNICODE);
        }
    }
?>
