function Main() {
    this.type = VISU_TYPE.MAIN;
    this.container = {};
    this.data = [];//[id, mark, value, status]
    this.initialized = false;
    this.t1 = null;
    this.addB = null;
    this.delB = null;
    this.saveB = null;
    this.getB = null;
    this.bb = null;
    this.update = true;//editor will make it false
    this.last_sr = -1;
    this.last_sc = -1;
    this.del_block = false;//to deal with delete button and table click collision
    this.ROW = {GROUP_ID: 0, VALUE: 1};
    this.ACTION = {
        GET: 1,
        SAVE: 2
    };
    this.PHONE_SIZE=12;
    this.visible = false;
    this.init = function () {
        try {
            var self = this;
            this.container = cvis();
            this.t1 = new Table(self, 1, trans, [[321, "35%"], [316, "65%"]]);
            this.t1.m_style = "copy_cell";
            this.t1.cellClickControl([true, true]);
            this.t1.enable();
            this.addB = cb("");
            this.delB = cb("");
            this.saveB = cb("");
            this.getB = cb("");
            this.bb = new BackButton();
            this.addB.onclick = function () {
                self.add();
            };
            this.delB.onclick = function () {
                self.delete();
            };
            this.saveB.onclick = function () {
                self.save();
            };
            this.getB.onclick = function () {
                self.getData();
            };
            var rcont = cd();
            a(rcont, [this.addB, this.delB, this.getB, this.saveB, this.bb]);
            a(this.container, [this.t1, rcont]);
            cla([this.t1], ["w70m", "lg1"]);
            cla([rcont], ["w30m", "lg1"]);
            cla([this.addB, this.delB, this.saveB, this.getB, this.bb], ["h20m", "ug1", "f1"]);
            this.initialized = true;
        } catch (e) {
            alert("main: init: " + e.message);
        }
    };
    this.getName = function () {
        try {
            return trans.get(407);
        } catch (e) {
            alert("main: getName: " + e.message);
        }
    };
    this.updateStr = function () {
        try {
            this.t1.updateHeader();
            this.addB.innerHTML = trans.get(50);
            this.delB.innerHTML = trans.get(51);
            this.saveB.innerHTML = trans.get(1);
            this.getB.innerHTML = trans.get(57);
            this.bb.updateStr();
        } catch (e) {
            alert("main: updateStr: " + e.message);
        }
    };
    this.cellChanged = function (id) {
        try {
            if (this.del_block) {
                this.del_block = false;
                return;
            }
            if (this.last_sc === this.t1.sc && this.last_sr === this.t1.sr) {
                switch (this.t1.sc) {
                    case this.ROW.GROUP_ID:
                        var self = this;
                        vint_edit.prep(this.data[this.t1.sr].group_id, 0, INT32_MAX, self, this.t1.sc, 315);
                        showV(vint_edit);
                        break;
                    case this.ROW.VALUE:
                        var self = this;
                        vstring_edit_smp.prep(this.data[this.t1.sr].value, this.PHONE_SIZE, self, this.t1.sc, 316);
                        showV(vstring_edit_smp);
                        break;
                }
            }
            this.last_sc = this.t1.sc;
            this.last_sr = this.t1.sr;
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("pid: cellChanged: " + e.message);
        }
    };
    this.catchEdit = function (d, k) {
        try {
            switch (k) {
                case this.ROW.GROUP_ID:
                    this.data[this.t1.sr].group_id = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].group_id);
                    break;
                case this.ROW.VALUE:
                    this.data[this.t1.sr].value = d;
                    this.t1.updateCell(this.t1.sr, this.t1.sc, this.data[this.t1.sr].value);
                    break;
                default:
                    console.log("main: catchEdit: bad k");
                    break;
            }
        } catch (e) {
            alert("main: catchEdit: " + e.message);
        }
    };
    this.btnCntDel = function () {
        try {
            if (this.data.length && this.t1.sr >= 0) {
                this.delB.disabled = false;
                return;
            }
            this.delB.disabled = true;
        } catch (e) {
            alert("main: btnCntDel: " + e.message);
        }
    };
    this.btnCntAdd = function () {
        try {
            this.addB.disabled = false;
        } catch (e) {
            alert("main: btnCntAdd: " + e.message);
        }
    };
    this.add = function () {
        try {
            var next_id = 1;
            if (this.data.length && this.t1.sr >= 0) {
                next_id = this.data[this.t1.sr].group_id;
            }
            this.data.push({group_id: next_id, value: ""});
            this.t1.appendRow([this.data[this.data.length - 1].group_id, this.data[this.data.length - 1].value]);
        } catch (e) {
            alert("main: add: " + e.message);
        }
    };
    this.delete = function () {
        try {
            this.del_block = true;
            this.data.splice(this.t1.sr, 1);
            this.t1.deleteSelectedRow();
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("pid: delete: " + e.message);
        }
    };
    this.getData = function () {
        var data = [
            {
                action: ["phone_book", "geta"]
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, "json_db");
    };
    this.save = function () {
        var data = [
            {
                action: ['phone_book', 'save'],
                param: this.data
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SAVE, "json_db");
    };
    this.confirm = function (action, d, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    cleara(this.data);
                    var i = 0;
                    for (i = 0; i < d.length; i++) {
                        this.data.push({
                            group_id: d[i].group_id,
                            value: d[i].value
                        });
                    }
                    this.redrawTbl();
                    break;
                case this.ACTION.SAVE:

                    break;
                default:
                    console.log("confirm: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("main: confirm: " + e.message);
        }
    };
    this.abort = function (action, m, n) {
        try {
            switch (action) {
                case this.ACTION.GET:
                    logger.err(250);
                    break;
                case this.ACTION.SAVE:
                    logger.err(257);
                    break;
                default:
                    console.log("abort: unknown action");
                    break;
            }
            cursor_blocker.disable();
        } catch (e) {
            alert("main: abort: " + e.message);
        }
    };
    this.redrawTbl = function () {
        try {
            this.last_sc = -1;
            this.last_sr = -1;
            this.t1.clear();
            for (var i = 0; i < this.data.length; i++) {
                this.t1.appendRow([this.data[i].group_id, this.data[i].value]);
            }
            this.btnCntDel();
            this.btnCntAdd();
        } catch (e) {
            alert("main: redrawTbl: " + e.message);
        }
    };
    this.show = function () {
        try {
            clr(this.container, "hdn");
            document.title = this.getName();
            if (this.update) {
                this.getData();
            }
            this.visible = true;
        } catch (e) {
            alert("main: show: " + e.message);
        }
    };
    this.hide = function () {
        try {
            cla(this.container, 'hdn');
            this.visible = false;
        } catch (e) {
            alert("main: hide: " + e.message);
        }
    };
}
var vmain = new Main();
visu.push(vmain);
