<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

require_once('database.php');
$db = new Database();

require_once('src/model/Checklist.php');
require_once('src/controller/ChecklistController.php');

use src\model\Checklist;
use src\controller\ChecklistController;

$checklistModel = new Checklist($db);
$checklistController = new ChecklistController($checklistModel);
?>