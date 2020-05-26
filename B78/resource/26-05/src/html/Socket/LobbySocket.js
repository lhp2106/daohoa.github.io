/**
 * Created by kk on 11/9/2016.
 */

var socket = socket || {};

/* lobby */
socket.LobbySocket = socket.LobbySocket || {};
socket.LobbySocket.NotConnection = 0;
socket.LobbySocket.Connecting = 1;
socket.LobbySocket.Connected = 2;
socket.LobbySocket.ConnectFailure = 3;
socket.LobbySocket.LostConnection = 4;
socket.LobbySocket.Closed = 5;

socket.LobbySocket.StatusName = socket.LobbySocket.StatusName || {};
socket.LobbySocket.StatusName[socket.LobbySocket.NotConnection] = "NotConnected";
socket.LobbySocket.StatusName[socket.LobbySocket.Connecting] = "Connecting";
socket.LobbySocket.StatusName[socket.LobbySocket.Connected] = "Connected";
socket.LobbySocket.StatusName[socket.LobbySocket.ConnectFailure] = "ConnectFailure";
socket.LobbySocket.StatusName[socket.LobbySocket.LostConnection] = "LostConnection";
socket.LobbySocket.StatusName[socket.LobbySocket.Closed] = "Closed";

socket.LobbyClient = function(zoneName){
    if(hiepnh.isUndefined(zoneName)) this.zoneName = Constant.CONSTANT.ZONE_NAME;
    else this.zoneName = zoneName;
    this.ctor = function () {
        this.wsocket = null;
        this.socketStatus = socket.LobbySocket.NotConnection;
        this._waitingPing = false;
        this._idPing = 0;
        var thiz = this;
        function onTimerTick() {
            thiz.updatePing();
        }
        setInterval(onTimerTick, 5000); // 5s
    };

    this.updatePing = function () {
        //cc.log("[Lobby] updatePing");
        if(this.wsocket && this.socketStatus == socket.LobbySocket.Connected){
            if(this._waitingPing){
                //lost ping
                cc.log("[Lobby] lost PING");
                this.closeSocket();
                this.setSocketStatus(socket.LobbySocket.LostConnection);
            }
            else{
                //send ping
                var pingMessage = [
                    command.PingMessage,
                    this.zoneName,
                    ++this._idPing,
                    new Date().getTime()
                ];
                //cc.log("[Lobby] send PING "+JSON.stringify(pingMessage));
                this.send(JSON.stringify(pingMessage));
                this._waitingPing = true;
                this._sendPingTime = Date.now();
            }
        }
    };

    this.connect = function (url) {
        if(this.wsocket){
            this.close();
        }
        this.setSocketStatus(socket.LobbySocket.Connecting);
        var wsocket = new WebSocket(url, [], "res/cacert.pem");
        this.wsocket = wsocket;

        var thiz = this;

        this.wsocket.onopen = function (event) {
          //  cc.log("onOpen: "+event.type);
            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz._waitingPing = false;
                thiz.setSocketStatus(socket.LobbySocket.Connected);
            }
        };
        this.wsocket.onmessage = function (event) {
          //  cc.log("onmessage: "+event.type);
            thiz.onRecvMessage(event.data);
        };
        this.wsocket.onerror = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else if(thiz.socketStatus == socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
        this.wsocket.onclose = function (event) {
            thiz.closeSocket();
            if(thiz.socketStatus == socket.LobbySocket.Connecting){
                thiz.setSocketStatus(socket.LobbySocket.ConnectFailure);
            }
            else if(thiz.socketStatus == socket.LobbySocket.Connected){
                thiz.setSocketStatus(socket.LobbySocket.LostConnection);
            }
        };
    };

    this.close = function () {
        this.closeSocket();
        if(this.socketStatus == socket.LobbySocket.Connected){
            this.setSocketStatus(socket.LobbySocket.Closed);
        }
    };

    this.closeSocket = function () {
        if(this.wsocket){
            this.resetSocket();
            if(this.wsocket.readyState == 0){ //connecting
                var ws = this.wsocket;
                ws.onopen = function () { //close when open
                    ws.close();
                };
            }
            else if(this.wsocket.readyState == 1){ //open
                this.wsocket.close();
            }
            this.wsocket = null;
        }
    };

    this.resetSocket = function () {
        if(this.wsocket){
            this.wsocket.onopen = 0;
            this.wsocket.onmessage = 0;
            this.wsocket.onerror = 0;
            this.wsocket.onclose = 0;
        }
    };

    this.setSocketStatus = function (status) {
        this.socketStatus = status;
        if(this.onEvent){
            this.onEvent("socketStatus", socket.LobbySocket.StatusName[this.socketStatus]);
        }
    };

    this.onRecvMessage = function (data) {
        var obj = JSON.parse(data);

        var cmd = obj[0];
        //console.log("cmd "+cmd);
        if(cmd === command.PingResponse){
            var latency = Date.now() - this._sendPingTime;
            //cc.log("[Lobby] Recv PING: "+latency.toString() + "ms");

            this._waitingPing = false;
            if(this.onEvent) {
                var _dataPing = {latency:latency};

                this.onEvent("ping", _dataPing);
                //console.log(obj);
            }
        }
        else{
            if(this.onEvent) {
                this.onEvent("message", data);
                //console.log("onRecvMessage "+JSON.stringify(data));
            }
        }
    };

    this.send = function (data) {
        if(this.wsocket && this.socketStatus == socket.LobbySocket.Connected){
            this.wsocket.send(data);
        }
    };

    this.ctor();
};

/* lobby */
socket.LobbyClient.NotConnection = 0;
socket.LobbyClient.Connecting = 1;
socket.LobbyClient.Connected = 2;
socket.LobbyClient.ConnectFailure = 3;
socket.LobbyClient.LostConnection = 4;
socket.LobbyClient.Closed = 5;

socket.LobbyClient.UDT = 0;
socket.LobbyClient.TCP = 1;