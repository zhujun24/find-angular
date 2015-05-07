<?php
header("Content-Type: text/html;charset=utf-8");
session_cache_limiter(false);
session_start();
require 'Slim/Slim.php';

$app = new Slim();

$app->get('/', 'hello');
$app->get('/equipment', 'getAllEquipment'); //获取所有仪器
$app->get('/equipment/:eid', 'getEquipment'); //根据eid获取仪器
$app->get('/order', 'getAllOrder'); //获取所有订单
$app->get('/userorder', 'getUserOrder'); //获取用户的订单
$app->get('/maps', 'getMaps'); //获取楼层信息
$app->get('/news', 'getNews'); //获取所有新闻通知
$app->get('/user', 'getUser'); //获取所有校内用户
$app->get('/shiyanyuan', 'getShiyanyuan'); //获取所有实验员
$app->get('/equipmentorder/:id', 'getEquipmentOrder'); //根据eid获取该仪器的所有订单
$app->get('/new/:id', 'getNew'); //根据nid获取新闻通知
$app->get('/checkeduser', 'getCheckedUser'); //获得所有已审核用户
$app->get('/uncheckuser', 'getUncheckUser'); //获得所有未审核用户
$app->get('/lab', 'getLab'); //获得所有实验室
$app->post('/login', 'login'); //登陆
$app->post('/logout', 'logout'); //登出
$app->post('/register', 'register'); //注册
$app->post('/repeat', 'repeat'); //校外用户注册用户名查重
$app->post('/addorder', 'addOrder'); //用户添加订单
$app->post('/addshiyanyuan', 'addShiyanyuan'); //添加实验员
$app->post('/adduser', 'addUser'); //添加校内用户
$app->post('/switchstate', 'switchState'); //审核用户
$app->post('/addnew', 'addNew'); //添加新闻
$app->post('/addlab', 'addLab'); //添加实验室
$app->post('/refuse', 'refuse'); //拒绝订单
$app->post('/shiyanyuan', 'shiyanyuan'); //实验员通过订单
$app->post('/equipmentmonthorder', 'getEquipmentMonthOrder'); //获取仪器某月订单
$app->post('/admin', 'admin'); //管理员通过订单
$app->post('/uploadfloor/:id', 'uploadFloor'); //上传楼层图片
$app->post('/uploadequipment/:id', 'uploadEquipment'); //上传仪器图片
$app->put('/new/:id', 'updateNew'); //更新新闻通知
$app->put('/equipment/:id', 'updateEquipment'); //更新仪器信息
$app->put('/profile', 'updateProfile'); //更新用户信息
$app->put('/lab/:id', 'updateLab'); //更新实验室
$app->put('/reset', 'resetPassword'); //重置密码
$app->put('/check', 'checkUser'); //审核用户状态
$app->delete('/new/:id', 'deleteNew'); //根据nid删除新闻通知
$app->delete('/equipment/:id', 'deleteEquipment'); //根据eid删除仪器
$app->delete('/order/:id', 'deleteOrder'); //根据oid删除订单
$app->delete('/deleteshiyanyuan/:id', 'deleteShiyanyuan'); //根据iid删除实验员
$app->delete('/deletelab/:id', 'deleteLab'); //根据lid删除实验室

$app->run();

function getConnection()
{
    $dbhost = "localhost";
    $dbuser = "root";
    $dbpass = "";
    $dbname = "shiyanshi";
    $dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $dbh;
}

function hello()
{
    echo 'Hello world!';
}

function login()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($json->usertype) && $json->usertype == 0) {
        $sql = "SELECT * FROM outside WHERE status='1' AND username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 1) {
        $sql = "SELECT * FROM user WHERE status='1' AND username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 2) {
        $sql = "SELECT * FROM shiyanyuan WHERE username='" . $json->username . "'LIMIT 1";
    } else if ($json->usertype == 3) {
        $sql = "SELECT * FROM admin WHERE username='" . $json->username . "'LIMIT 1";
    } else {
        //未知用户类型
        echo '{"data": "", "code": "001"' . '}';
        exit;
    }

    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetch(PDO::FETCH_OBJ);
    $db = null;

    if (!empty($result)) {
        $password = md5($json->password);
        if ($result->password == $password) {
            $_SESSION['uid'] = $result->uid;
            $_SESSION['usertype'] = $result->usertype;
            unset($result->password);
            $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
            echo $result;
        } else {
            //密码错误
            echo '{"data": "", "code": "002"' . '}';
        }
    } else {
        //用户不存在
        echo '{"data": "", "code": "003"' . '}';
    }
}

function logout()
{
    unset($_SESSION['usertype']);
    unset($_SESSION['uid']);
    session_destroy();
    $result = '{"data": "", "code":"000"}';
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

function register()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);
    if (empty($json->username)) {
        echo '{"data": "", "code": "002"' . '}';
        //用户名为空，拒绝注册
        exit;
    } else {
        $sql = "SELECT username FROM outside WHERE username='" . $json->username . "'";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    }

    if (empty($result)) {
        //用户名没有重复，可以注册
        $sql = "INSERT INTO outside (username, password, name, phone, unit, head, headphone) VALUES (:username, :password, :name, :phone, :unit, :head, :headphone)";

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $password = md5($json->password);
        $stmt->bindParam("username", $json->username);
        $stmt->bindParam("password", $password);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("phone", $json->phone);
        $stmt->bindParam("unit", $json->unit);
        $stmt->bindParam("head", $json->head);
        $stmt->bindParam("headphone", $json->headphone);
        $stmt->execute();
        $json->uid = $db->lastInsertId();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //注册成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //用户名重复，拒绝注册
    }
}

function addOrder()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && isset($_SESSION['uid']) && ($_SESSION['usertype'] == 0 || $_SESSION['usertype'] == 1)) {
        if ($_SESSION['usertype'] == 0) {
            $sql = "SELECT name FROM outside WHERE uid='" . $_SESSION['uid'] . "'";
        } else if ($_SESSION['usertype'] == 1) {
            $sql = "SELECT name FROM user WHERE uid='" . $_SESSION['uid'] . "'";
        } else {
            echo '{"data": "", "code": "002"' . '}';
            //用户错误
            exit;
        }

        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetch(PDO::FETCH_OBJ);
        $db = null;

        //用户已登陆
        $sql = "INSERT INTO orderlist (uid, usertype, eid, reason, year, month, date, apm, name) VALUES (:uid, :usertype, :eid, :reason, :year, :month, :date, :apm, :name)";

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uid", $_SESSION['uid']);
        $stmt->bindParam("usertype", $_SESSION['usertype']);
        $stmt->bindParam("eid", $json->eid);
        $stmt->bindParam("year", $json->year);
        $stmt->bindParam("month", $json->month);
        $stmt->bindParam("date", $json->date);
        $stmt->bindParam("apm", $json->apm);
        $stmt->bindParam("reason", $json->reason);
        $stmt->bindParam("name", $result->name);
        $stmt->execute();
        $json->oid = $db->lastInsertId();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //订单生成成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限，订单生成失败
    }
}

function addNew()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆

        $sql = "INSERT INTO news (publishTime, title, content) VALUES (:publishTime, :title, :content)";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $publishTime = date('Y-m-d');
        $stmt->bindParam("publishTime", $publishTime);
        $stmt->bindParam("title", $json->title);
        $stmt->bindParam("content", $json->content);
        $stmt->execute();
        $json->nid = $db->lastInsertId();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //新闻通知添加成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限，新闻通知添加失败
    }
}

function getMaps()
{
    $sql = "SELECT * FROM maps";
    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function getNews()
{
    $sql = "SELECT * FROM news";
    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function getNew($nid)
{
    $sql = "SELECT * FROM news WHERE nid=:nid";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("nid", $nid);
    $stmt->execute();
    $result = $stmt->fetchObject();
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;

}

function getAllEquipment()
{
    $sql = "SELECT eid,scr,alt,name,model,factory,used,des,state,headPerson,headNum FROM equipment";
    $db = getConnection();
    $stmt = $db->query($sql);
    $result = $stmt->fetchAll(PDO::FETCH_OBJ);
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function getEquipment($eid)
{
    $sql = "SELECT * FROM equipment WHERE eid=:eid";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("eid", $eid);
    $stmt->execute();
    $result = $stmt->fetchObject();
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;

}

function getAllOrder()
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        $sql = "SELECT * FROM orderlist";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
        echo $result;
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function getUserOrder()
{
    if (isset($_SESSION['usertype']) && isset($_SESSION['uid']) && ($_SESSION['usertype'] == 0 || $_SESSION['usertype'] == 1)) {
        $sql = "SELECT * FROM orderlist,equipment WHERE orderlist.eid=equipment.eid AND uid='" . $_SESSION['uid'] . "' AND usertype='" . $_SESSION['usertype'] . "'";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
        echo $result;
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function refuse()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        $sql = "UPDATE orderlist SET status=:status,refuseReason=:refuseReason WHERE oid=:oid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $json->status = 0;
        $stmt->bindParam("status", $json->status);
        $stmt->bindParam("refuseReason", $json->refuseReason);
        $stmt->bindParam("oid", $json->oid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //拒绝订单成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function shiyanyuan()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);
    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 2) {
        //实验员已登陆
        if ($json->status == 0) {
            $sql = "UPDATE orderlist SET status=0 WHERE oid=:oid";
        } else if ($json->status == 2) {
            $sql = "UPDATE orderlist SET status=2 WHERE oid=:oid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //订单状态参数不符合条件，实验员通过订单失败
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $json->status = 2;
        $stmt->bindParam("oid", $json->oid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //实验员审核订单成功
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function admin()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);
    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        //管理员已登陆
        if ($json->status == 0) {
            $sql = "UPDATE orderlist SET status=0 WHERE oid=:oid";
        } else if ($json->status == 3) {
            $sql = "UPDATE orderlist SET status=3 WHERE oid=:oid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //订单状态参数不符合条件，实验员通过订单失败
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("oid", $json->oid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //管理员审核订单成功
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function updateNew($nid)
{
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $json = json_decode($body);
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "UPDATE news SET title=:title, content=:content WHERE nid=:nid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("title", $json->title);
        $stmt->bindParam("content", $json->content);
        $stmt->bindParam("nid", $nid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //管理员实验员更新新闻通知成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function updateEquipment($eid)
{
    $request = Slim::getInstance()->request();
    $body = $request->getBody();
    $json = json_decode($body);
    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        //管理员已登陆
        $sql = "UPDATE equipment SET lid=:lid, scr=:scr, alt=:alt, name=:name, model=:model, factory=:factory, used=:used, qualification=:qualification, des=:des, state=:state, headPerson=:headPerson, headNum=:headNum WHERE eid=:eid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("lid", $json->lid);
        $stmt->bindParam("scr", $json->scr);
        $stmt->bindParam("alt", $json->alt);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("model", $json->model);
        $stmt->bindParam("factory", $json->factory);
        $stmt->bindParam("used", $json->used);
        $stmt->bindParam("qualification", $json->qualification);
        $stmt->bindParam("des", $json->des);
        $stmt->bindParam("state", $json->state);
        $stmt->bindParam("headPerson", $json->headPerson);
        $stmt->bindParam("headNum", $json->headNum);
        $stmt->bindParam("eid", $eid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //管理员更新仪器信息成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function deleteNew($nid)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "DELETE FROM news WHERE nid=:nid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("nid", $nid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //管理员实验员删除新闻通知成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function getEquipmentOrder($eid)
{
    $sql = "SELECT * FROM orderlist WHERE eid=:eid";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("eid", $eid);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}


function getEquipmentMonthOrder()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    $sql = "SELECT * FROM orderlist WHERE eid=:eid AND month=:month";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->bindParam("eid", $json->eid);
    $stmt->bindParam("month", $json->month);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}


function resetPassword()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype'])) {
        if ($_SESSION['usertype'] == 0) {
            $sql = "UPDATE outside SET password=:password WHERE uid=:uid";
        } else if ($_SESSION['usertype'] == 1) {
            $sql = "UPDATE user SET password=:password WHERE uid=:uid";
        } elseif ($_SESSION['usertype'] == 2) {
            $sql = "UPDATE shiyanyuan SET password=:password WHERE uid=:uid";
        } elseif ($_SESSION['usertype'] == 3) {
            $sql = "UPDATE admin SET password=:password WHERE uid=:uid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //未知用户类型
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $password = md5($json->password);
        $stmt->bindParam("password", $password);
        $stmt->bindParam("uid", $_SESSION['uid']);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //修改密码成功
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function updateProfile()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype'])) {
        if ($_SESSION['usertype'] == 0) {
            $sql = "UPDATE outside SET username=:username, name=:name, phone=:phone, unit=:unit, head=:head, headphone=:headphone WHERE uid=:uid";
        } else if ($_SESSION['usertype'] == 1) {
            $sql = "UPDATE user SET username=:username, name=:name, phone=:phone, unit=:unit, head=:head, headphone=:headphone WHERE uid=:uid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //未知用户类型
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("username", $json->username);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("phone", $json->phone);
        $stmt->bindParam("unit", $json->unit);
        $stmt->bindParam("head", $json->head);
        $stmt->bindParam("headphone", $json->headphone);
        $stmt->bindParam("uid", $_SESSION['uid']);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //修改资料成功
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function switchState()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        if ($json->state == 0) {
            $sql = "UPDATE equipment SET state=1 WHERE eid=:eid";
        } else if ($json->state == 1) {
            $sql = "UPDATE equipment SET state=0 WHERE eid=:eid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //状态参数state错误
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eid", $json->eid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function addShiyanyuan()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        if (empty($json->username)) {
            echo '{"data": "", "code": "002"' . '}';
            //实验员用户名为空，拒绝注册
            exit;
        } else {
            $sql = "SELECT username FROM shiyanyuan WHERE username='" . $json->username . "'";
            $db = getConnection();
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
        }

        if (empty($result)) {
            //用户名没有重复，可以注册
            $sql = "SELECT name FROM equipment WHERE eid='" . $json->eid . "'";

            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $equipmentName = $stmt->fetchObject();

            $sql = "INSERT INTO shiyanyuan (username, password, phone, eid, equipmentName) VALUES (:username, :password, :phone, :eid, :equipmentName)";

            $db = getConnection();
            $stmt = $db->prepare($sql);
            $password = md5($json->password);
            $stmt->bindParam("username", $json->username);
            $stmt->bindParam("phone", $json->phone);
            $stmt->bindParam("eid", $json->eid);
            $stmt->bindParam("equipmentName", $equipmentName->name);
            $stmt->bindParam("password", $password);
            $stmt->execute();
            $json->uid = $db->lastInsertId();
            $db = null;
            echo '{"data": "", "code": "000"' . '}';
            //注册成功
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //实验员用户名重复，拒绝注册
        }
    } else {
        echo '{"data": "", "code": "003"' . '}';
        //没有权限
    }
}

function deleteShiyanyuan($uid)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "DELETE FROM shiyanyuan WHERE uid=:uid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uid", $uid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //实验员删除成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function deleteOrder($oid)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 0 || $_SESSION['usertype'] == 1)) {
        //用户已登陆
        $sql = "DELETE FROM orderlist WHERE oid=:oid AND uid=:uid AND usertype=:usertype";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("oid", $oid);
        $stmt->bindParam("uid", $_SESSION['uid']);
        $stmt->bindParam("usertype", $_SESSION['usertype']);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //订单删除成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function checkUser()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        if ($json->usertype == 0 && $json->status == 0) {
            $sql = "UPDATE outside SET status=1 WHERE uid=:uid";
        } else if ($json->usertype == 0 && $json->status == 1) {
            $sql = "UPDATE outside SET status=0 WHERE uid=:uid";
        } else if ($json->usertype == 1 && $json->status == 1) {
            $sql = "UPDATE user SET status=0 WHERE uid=:uid";
        } else if ($json->usertype == 1 && $json->status == 0) {
            $sql = "UPDATE user SET status=1 WHERE uid=:uid";
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //状态参数usertype错误
            exit;
        }

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("uid", $json->uid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
    } else {
        echo '{"data": "", "code": "002"' . '}';
        //没有权限
    }
}

function getCheckedUser()
{
    $sql = "SELECT * FROM outside WHERE status=1";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $db = null;

    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function getUncheckUser()
{
    $sql = "SELECT * FROM outside WHERE status=0";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $db = null;

    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function addLab()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        //管理员登陆，可以添加实验室
        $sql = "INSERT INTO lab (name, place, instrument, ranges, content, introduction) VALUES (:name, :place, :instrument, :ranges, :content, :introduction)";

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("place", $json->place);
        $stmt->bindParam("instrument", $json->instrument);
        $stmt->bindParam("ranges", $json->ranges);
        $stmt->bindParam("content", $json->content);
        $stmt->bindParam("introduction", $json->introduction);
        $stmt->execute();
        $json->lid = $db->lastInsertId();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //实验室添加成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function deleteLab($lid)
{
    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        //用户已登陆
        $sql = "DELETE FROM lab WHERE lid=:lid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("lid", $lid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //删除实验室成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function updateLab($lid)
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && $_SESSION['usertype'] == 3) {
        $sql = "UPDATE lab SET name=:name, place=:place, instrument=:instrument, ranges=:ranges, content=:content, introduction=:introduction WHERE lid=:lid";

        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("name", $json->name);
        $stmt->bindParam("place", $json->place);
        $stmt->bindParam("instrument", $json->instrument);
        $stmt->bindParam("ranges", $json->ranges);
        $stmt->bindParam("content", $json->content);
        $stmt->bindParam("introduction", $json->introduction);
        $stmt->bindParam("lid", $lid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //修改实验室成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function getLab()
{
    $sql = "SELECT * FROM lab";
    $db = getConnection();
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $result = $stmt->fetchAll();
    $db = null;
    $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
    echo $result;
}

function addUser()
{
    $request = Slim::getInstance()->request();
    $json = $request->getBody();
    $json = json_decode($json);

    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        if (empty($json->username)) {
            echo '{"data": "", "code": "002"' . '}';
            //实验员用户名为空，拒绝注册
            exit;
        } else {
            $sql = "SELECT username FROM user WHERE username='" . $json->username . "'";
            $db = getConnection();
            $stmt = $db->query($sql);
            $result = $stmt->fetchAll(PDO::FETCH_OBJ);
            $db = null;
        }

        if (empty($result)) {
            //用户名没有重复，可以注册
            $sql = "INSERT INTO user (username, password, name, phone, unit, head, headphone) VALUES (:username, :password, :name, :phone, :unit, :head, :headphone)";

            $db = getConnection();
            $stmt = $db->prepare($sql);
            $password = md5($json->password);
            $stmt->bindParam("username", $json->username);
            $stmt->bindParam("password", $password);
            $stmt->bindParam("name", $json->name);
            $stmt->bindParam("phone", $json->phone);
            $stmt->bindParam("unit", $json->unit);
            $stmt->bindParam("head", $json->head);
            $stmt->bindParam("headphone", $json->headphone);
            $stmt->execute();
            $json->uid = $db->lastInsertId();
            $db = null;
            echo '{"data": "", "code": "000"' . '}';
            //注册成功
        } else {
            echo '{"data": "", "code": "001"' . '}';
            //校内用户名重复，拒绝注册
        }
    } else {
        echo '{"data": "", "code": "003"' . '}';
        //没有权限
    }
}

function getUser()
{

    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "SELECT * FROM user";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        foreach ($result as $key => $value) {
            unset($value->password);
        }
        $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
        echo $result;
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function getShiyanyuan()
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "SELECT * FROM shiyanyuan";
        $db = getConnection();
        $stmt = $db->query($sql);
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        foreach ($result as $key => $value) {
            unset($value->password);
        }
        $result = '{"data": ' . json_encode($result) . ', "code":"000"' . '}';
        echo $result;
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function deleteEquipment($eid)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $sql = "DELETE FROM equipment WHERE eid=:eid";
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->bindParam("eid", $eid);
        $stmt->execute();
        $db = null;
        echo '{"data": "", "code": "000"' . '}';
        //管理员实验员删除仪器成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function uploadFloor($id)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $filename = $_FILES['file']['name'];
        $ext = substr(strrchr($filename, '.'), 1);
        if (strtolower($ext) == "jpg") {
            $filename = $id . '.jpg';
        } else {
            echo '{"data": "", "code": "002"' . '}';
            exit;
            //图片格式错误
        }
        $destination = '../images/floors/' . $filename;
        move_uploaded_file($_FILES['file']['tmp_name'], $destination);
        echo '{"data": "", "code": "000"' . '}';
        //上传图片成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

function uploadEquipment($id)
{
    if (isset($_SESSION['usertype']) && ($_SESSION['usertype'] == 2 || $_SESSION['usertype'] == 3)) {
        //实验员管理员已登陆
        $filename = $_FILES['file']['name'];
        $ext = substr(strrchr($filename, '.'), 1);

        if (strtolower($ext) == "jpg") {
            $filename = $id . '.jpg';
        } else {
            echo '{"data": "", "code": "002"' . '}';
            exit;
            //图片格式错误
        }
        $destination = '../images/equipment/' . $filename;
        move_uploaded_file($_FILES['file']['tmp_name'], $destination);
        echo '{"data": "", "code": "000"' . '}';
        //上传图片成功
    } else {
        echo '{"data": "", "code": "001"' . '}';
        //没有权限
    }
}

?>