<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
$arr=null;
$conn = new mysqli("localhost", "react_160419098","ubaya","react_160419098");
  if($conn->connect_error) {
    $arr= ["result"=>"error","message"=>"unable to connect"];
  }
  extract($_POST);
  $sql="INSERT INTO jadwal(foto,informasi_dolanan,alamat,nama_tempat,tanggal,jam_dolanan,jumlah_pemain) VALUES(?,?,?,?,?,?,?)";
  $stmt=$conn->prepare($sql);
  $stmt->bind_param("sssssii",$foto,$informasi_dolanan,$alamat,$nama_tempat,$tanggal,$jam_dolanan,$jumlah_pemain);
  $stmt->execute();
  if ($stmt->affected_rows > 0) {
    $arr=["result"=>"success","id"=>$conn->insert_id];
  } else {
    $arr=["result"=>"fail","Error"=>$conn->error];
  }
  echo json_encode($arr);
?>