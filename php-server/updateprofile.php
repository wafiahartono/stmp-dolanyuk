<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
$arr=null;
$conn = new mysqli("localhost", "react_160419098","ubaya","react_160419098");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }
  extract($_POST);
  $sql="UPDATE user SET nama_lengkap=?, foto=?";
  $stmt=$conn->prepare($sql);
  $stmt->bind_param("ss",$nama_lengkap,$foto);
  $stmt->execute();
  if ($stmt->affected_rows > 0) {
    $arr=["result"=>"success","message"=>"Berhasil Update Data User"];
  } else {
    $arr=["result"=>"fail","Error"=>$conn->error];
  }
  echo json_encode($arr);
?>