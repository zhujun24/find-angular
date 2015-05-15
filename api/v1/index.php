<?php

date_default_timezone_set("Asia/Shanghai");
header("Content-Type: text/html;charset=utf-8");
session_cache_limiter(false);
session_start();
require '../Slim/Slim.php';

$app = new Slim();

$app->get('/', 'hello');

//用户模块
$app->post('/login', 'login'); //登陆
$app->post('/logout', 'logout'); //登出
$app->post('/reg', 'reg'); //注册
$app->post('/repeat', 'repeat'); //校外用户注册用户名查重

//首页表格信息
$app->get('/index', 'index');

//根据pid获取信息
$app->get('/p/:pid', 'getP');

//发布评论
$app->post('/comment', 'commentPub');

//根据uid获取个人中心信息
$app->get('/zone/:uid', 'getZone');

$app->run();

function getConnection()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "find-angular";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function hello()
{
    echo "Hello World!!!";
}

function login()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    $sql = "SELECT * FROM t_user WHERE uemail='" . $json->email . "'";
    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    $db = null;

    if (!empty($result)) {
        $password = md5($json->password);
        if ($result->upwd == $password) {
            $_SESSION['uid'] = $result->uid;

            $result = array("uid" => $result->uid, "email" => $result->uemail, "name" => $result->uname, "tel" => $result->utel, "qq" => $result->uqq, "header" => $result->uheader);
            $result = '{"meta": {"code": 201, "message": "登录成功"},"data": ' . json_encode($result) . '}';
            echo $result;
        } else {
            //密码错误
            $result = '{"meta": {"code": 202, "message": "密码错误"},"data": ""}';
            echo $result;
        }
    } else {
        //用户不存在
        $result = '{"meta": {"code": 203, "message": "用户不存在"},"data": ""}';
        echo $result;
    }
}

function logout()
{
    unset($_SESSION['uid']);
    session_destroy();
    $result = '{"meta": {"code": 201, "message": "登出成功"},"data": ""}';
    echo $result;
}

function repeat()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (!empty($json->username)) {
        $sql = "SELECT username FROM outside WHERE username='" . $json->username . "'";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;

        if (empty($result)) {
            echo '{"data": "", "code": "000"' . '}';
            //用户名没有重复，可以注册
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //用户名重复，拒绝注册
        }
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //接受username为空
    }
}

function reg()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    $sqlname = "SELECT uname FROM t_user WHERE uname='" . $json->name . "'";
    $sqlemail = "SELECT uemail FROM t_user WHERE uemail='" . $json->email . "'";
    $db = getConnection();
    $stmtname = $db->query($sqlname);
    $stmtemail = $db->query($sqlemail);
    $resultname = $stmtname->fetchAll(PDO::FETCH_OBJ);
    $resultemail = $stmtemail->fetchAll(PDO::FETCH_OBJ);

    if (empty($resultname)) {
        if (empty($resultemail)) {
            //昵称、邮箱没有重复，可以注册
            $sql = "INSERT INTO t_user (uname, uemail, upwd, utel, uqq) VALUES (:uname, :uemail, :upwd, :utel, :uqq)";

            $stmt = $db->prepare($sql);
            $password = md5($json->password);
            $stmt->bindParam("uname", $json->name);
            $stmt->bindParam("uemail", $json->email);
            $stmt->bindParam("upwd", $password);
            $stmt->bindParam("utel", $json->tel);
            $stmt->bindParam("uqq", $json->qq);
            $stmt->execute();
            $db = null;
            $result = '{"meta": {"code": 201, "message": "注册成功"},"data": ""}';
            echo $result;
        } else {
            //邮箱存在
            $result = '{"meta": {"code": 202, "message": "邮箱存在"},"data": ""}';
            echo $result;
        }
    } else {
        //昵称存在
        $result = '{"meta": {"code": 203, "message": "昵称存在"},"data": ""}';
        echo $result;
    }
}

function index()
{
    $sql0 = "SELECT pid,pdate,pdetails,pitem,pname,plocation,ptype FROM t_publish WHERE ptype=0 ORDER BY pid DESC limit 8";
    $sql1 = "SELECT pid,pdate,pdetails,pitem,pname,plocation,ptype FROM t_publish WHERE ptype=1 ORDER BY pid DESC limit 8";
    $sql2 = "SELECT * FROM t_publish WHERE psucceed=1";
    $db = getConnection();
    $stmt0 = $db->query($sql0);
    $result0 = $stmt0->fetchAll(PDO::FETCH_OBJ);
    $stmt1 = $db->query($sql1);
    $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
    $stmt2 = $db->query($sql2);
    $result2 = $stmt2->fetchALl(PDO::FETCH_OBJ);
    $db = null;

    $result = array("lost" => $result0, "find" => $result1, "succeed" => count($result2), "year" => date("Y"));
    $result = '{"meta": {"code": 201, "message": "请求成功"},"data": ' . json_encode($result) . '}';
    echo $result;
}

function getP($pid)
{
    $sql0 = "SELECT uname,uheader,pid,ptime,pdetails,pimage FROM t_publish,t_user WHERE t_publish.pid=$pid AND t_user.uid=t_publish.uid";
    $sql1 = "SELECT uname,uheader,ctime,cdetails FROM t_comment,t_user WHERE t_comment.pid=$pid AND t_user.uid=t_comment.uid ORDER BY cid DESC";
    $db = getConnection();
    $stmt0 = $db->query($sql0);
    $result0 = $stmt0->fetch(PDO::FETCH_OBJ);
    $stmt1 = $db->query($sql1);
    $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
    $db = null;

    $result = array("publish" => $result0, "comment" => $result1);
    $result = '{"meta": {"code": 201, "message": "请求成功"},"data": ' . json_encode($result) . '}';
    echo $result;

}

function commentPub()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['uid']) && ($_SESSION['uid'] == $json->uid)) {
        //用户已登陆
        $sql = "INSERT INTO t_comment (pid, uid, cdetails) VALUES (:pid, :uid, :cdetails)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("pid", $json->pid);
        $stmt->bindParam("uid", $json->uid);
        $stmt->bindParam("cdetails", $json->cdetails);
        $stmt->execute();
        $json->cid = $db->lastInsertId();
        $db = null;

        $result = array("publishDate" => date("Y-m-d H:i:s"));
        $result = '{"meta": {"code": 201, "message": "评论成功"},"data": ' . json_encode($result) . '}';
        echo $result;
    } else {
        //用户未登陆
        $result = '{"meta": {"code": 202, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

function getZone($uid)
{
    if (isset($_SESSION['uid'])) {
        //用户已登陆
        $uid = ($_SESSION['uid']);
        $sql0 = "SELECT pid,ptime,pdetails,pimage,psucceed FROM t_publish WHERE uid=$uid AND t_publish.ptype=0 ORDER BY pid DESC";
        $sql1 = "SELECT pid,ptime,pdetails,pimage,psucceed FROM t_publish WHERE uid=$uid AND t_publish.ptype=1 ORDER BY pid DESC";
        $sql2 = "SELECT pid,cid,ctime,cdetails FROM t_comment WHERE uid=$uid ORDER BY cid DESC";
        $db = getConnection();
        $stmt0 = $db->query($sql0);
        $result0 = $stmt0->fetchAll(PDO::FETCH_OBJ);
        $stmt1 = $db->query($sql1);
        $result1 = $stmt1->fetchAll(PDO::FETCH_OBJ);
        $stmt2 = $db->query($sql2);
        $result2 = $stmt2->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        $result = array("lost" => $result0, "find" => $result1, "comment" => $result2);
        $result = '{"meta": {"code": 201, "message": "个人中心信息获取成功"},"data": ' . json_encode($result) . '}';
        echo $result;
    } else {
        //用户未登陆
        $result = '{"meta": {"code": 202, "message": "用户未登陆"},"data": ""}';
        echo $result;
    }
}

?>