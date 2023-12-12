<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
$arr=null;
$conn = new mysqli("localhost", "react_160419098","ubaya","react_160419098");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }
  extract($_POST);
  $sql="INSERT INTO ngobrol(chat,user_id) VALUES(?,?)";
  $stmt=$conn->prepare($sql);
  $stmt->bind_param("si",$chat,$user_id);
  $stmt->execute();
  if ($stmt->affected_rows > 0) {
    $arr=["result"=>"success","id"=>$conn->insert_id];
  } else {
    $arr=["result"=>"fail","Error"=>$conn->error];
  }
  echo json_encode($arr);
?>