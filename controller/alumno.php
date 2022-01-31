<?php
    class Alumno extends Controller
    {
        function __construct()
        {
            parent::__construct();
        }

        function index(){
            $this->view->render('alumno/index');
        }

        function insert() {
            $nombre = $_POST['nombre'];
            $apellido = $_POST['apellido'];
            $matricula = $_POST['matricula'];
            $data = array('nombre' => $nombre, 'apellido' => $apellido, 'matricula'=>$matricula);

            require 'model/alumnoDAO.php';
            $this->loadModel('AlumnoDAO');
            $alumnoDAO = new AlumnoDAO();
            $alumnoDAO->insert($data);
        }

        function update() {
            $nombre = $_POST['nombreActualizar'];
            $apellido = $_POST['apellidoActualizar'];
            $matricula = $_POST['matriculaActualizar'];
            $data = array('nombre' => $nombre, 'apellido' => $apellido, 'matricula'=>$matricula);

            require 'model/alumnoDAO.php';
            $this->loadModel('AlumnoDAO');
            $alumnoDAO = new AlumnoDAO();
            $alumnoDAO->update($data);
        }

        function delete(){
            $matricula = $_POST['idEliminarAlumno'];

            require 'model/alumnoDAO.php';
            $this->loadModel('AlumnoDAO');
            $alumnoDAO = new AlumnoDAO();
            $alumnoDAO->delete($matricula);
        }

        function read() {
            require 'model/alumnoDAO.php';
            $this->loadModel('AlumnoDAO');
            $alumnoDAO = new AlumnoDAO();
            $alumnoDAO = $alumnoDAO->read();
            echo $alumnoDAO;
        }
    }
