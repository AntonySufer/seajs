/*创建时间hSea 2015-07-27 20:32:39 PM */
define(function(require, exports, module) {
    function a(a) {
        a && a.preventDefault ? a.preventDefault() : window.event.returnValue = !1
    }
    function b(b, c, d, e) {
        if ("default" != o) {
            var f = '<div class="pop_tip' + (0 == c ? " right": " error") + '" id="pop_tip_alert"><span class="icon"></span><p><span style="display:block;text-align:center;padding:0 16px;font-size:16px">' + b + '</span></p><div class="btn"><a href="javascript:void(0);" id="pop_tip_alert_btn">' + (e || "确  定") + "</a></div></div>",
            g = function() {
                return m.layer({
                    type: 1,
                    title: !1,
                    closeBtn: !1,
                    shade: [.5, "#000", !0],
                    border: [5, .5, "", !0],
                    area: ["310px", "auto"],
                    offset: [.3 * m(window).height() + "px", ""],
                    page: {
                        html: f
                    },
                    success: function() {
                        window.ontouchmove = a;
                        var b = n.triggerEventName;
                        $x("pop_tip_alert", "pop_tip_alert_btn").off(b),
                        $x("pop_tip_alert", "pop_tip_alert_btn").on(b,
                        function() {
                            try {
                                layer.close(p)
                            } catch(a) {}
                            p = -9999,
                            d && d()
                        }),
                        m("#pop_tip_alert").css("margin-top", "-" + m("#pop_tip_alert").height() / 2 + "px")
                    },
                    end: function() {
                        window.ontouchmove = null
                    }
                })
            };
            if ( - 9999 == p) p = g();
            else {
                try {
                    layer.close(p)
                } catch(h) {}
                p = g()
            }
        } else {
            var i = 0 == c ? 1 : 3;
            p = m.layer({
                area: ["310px", "auto"],
                offset: [.3 * m(window).height() + "px", ""],
                dialog: {
                    btn: [e || "确  定"],
                    msg: b,
                    type: i,
                    yes: function(a) {
                        try {
                            layer.close(a)
                        } catch(b) {}
                        d && d()
                    }
                },
                title: "提示信息",
                border: [0, 0, "", !1],
                shade: [.5, "#000", !0],
                success: function() {
                    window.ontouchmove = a
                },
                end: function() {
                    window.ontouchmove = null
                }
            })
        }
    }
    function c(b, c, d, e, f) {
        if ("default" != o) {
            var g = '<div class="pop_tip notice" id="pop_tip_confirm"><span class="icon"></span><p><span style="display:block;text-align:center;padding:0 16px;font-size:16px">' + b + '</span></p><div class="btn"><a href="javascript:void(0);" id="pop_tip_confirm_yes">' + (e || "确 定") + '</a><a href="javascript:void(0);" id="pop_tip_confirm_no">' + (f || "取消") + "</a></div></div>",
            h = function() {
                return m.layer({
                    type: 1,
                    title: !1,
                    closeBtn: !1,
                    shade: [.5, "#000", !0],
                    border: [5, .5, "", !0],
                    area: ["310px", "auto"],
                    offset: [.3 * m(window).height() + "px", ""],
                    page: {
                        html: g
                    },
                    success: function() {
                        window.ontouchmove = a;
                        var b = n.triggerEventName;
                        $x("pop_tip_confirm", "pop_tip_confirm_yes").off(b),
                        $x("pop_tip_confirm", "pop_tip_confirm_yes").on(b,
                        function() {
                            try {
                                layer.close(q)
                            } catch(a) {}
                            q = -9999,
                            c && c()
                        }),
                        $x("pop_tip_confirm", "pop_tip_confirm_no").off(b),
                        $x("pop_tip_confirm", "pop_tip_confirm_no").on(b,
                        function() {
                            try {
                                layer.close(q)
                            } catch(a) {}
                            q = -9999,
                            d && d()
                        }),
                        m("#pop_tip_confirm").css("margin-top", "-" + m("#pop_tip_confirm").height() / 2 + "px")
                    },
                    end: function() {
                        window.ontouchmove = null
                    }
                })
            };
            if ( - 9999 == q) q = h();
            else {
                try {
                    layer.close(q)
                } catch(i) {}
                q = h()
            }
        } else q = m.layer({
            area: ["310px", "auto"],
            offset: [.3 * m(window).height() + "px", ""],
            dialog: {
                btns: 2,
                btn: [e || "确 定", f || "取消"],
                msg: b,
                type: 4,
                yes: function(a) {
                    try {
                        layer.close(a)
                    } catch(b) {}
                    c && c()
                },
                no: function(a) {
                    try {
                        layer.close(a)
                    } catch(b) {}
                    d && d()
                }
            },
            title: "提示信息",
            border: [0, 0, "", !1],
            shade: [.5, "#000", !0],
            success: function() {
                window.ontouchmove = a
            },
            end: function() {
                window.ontouchmove = null
            }
        })
    }
    function d(b, c, d) {
        if (null != v && (clearTimeout(v), v = null), d = d > 0 ? d: 2, "default" != o) {
            var e = '<div class="pop_tip' + (0 == b ? " right": " error") + '" id="pop_tip_msg"><span class="icon"></span><p><span style="display:block;text-align:center;padding:0 16px;font-size:16px">' + c + "</span></p></div>",
            f = function() {
                var b = m.layer({
                    type: 1,
                    title: !1,
                    closeBtn: !1,
                    shadeClose: !0,
                    shade: [.5, "#000", !0],
                    border: [5, .5, "", !0],
                    area: ["310px", "auto"],
                    offset: [.3 * m(window).height() + "px", ""],
                    page: {
                        html: e
                    },
                    success: function() {
                        window.ontouchmove = a,
                        m("#pop_tip_msg").css("margin-top", "-" + m("#pop_tip_msg").height() / 2 + "px")
                    },
                    end: function() {
                        window.ontouchmove = null
                    }
                });
                return v = setTimeout(function() {
                    try {
                        layer.close(r)
                    } catch(a) {}
                    r = -9999
                },
                1e3 * d),
                b
            };
            if ( - 9999 == r) r = f();
            else {
                try {
                    layer.close(r)
                } catch(g) {}
                r = f()
            }
        } else {
            var h = 0 == b ? 1 : 3;
            r = m.layer({
                area: ["310px", "auto"],
                offset: [.4 * m(window).height() + "px", ""],
                closeBtn: [0, !1],
                shadeClose: !0,
                time: d,
                dialog: {
                    btns: 0,
                    msg: c,
                    type: h
                },
                title: !1,
                border: [0, 0, "", !1],
                shade: [.5, "#000", !0],
                success: function() {
                    window.ontouchmove = a
                },
                end: function() {
                    window.ontouchmove = null
                }
            })
        }
    }
    function e(a, b) {
        s = layer.tips(a, m(b), 0, 200, 0, ["background-color:#CC0000; color:#fff", "#CC0000"]),
        m(b).ScrollTo(200)
    }
    function f(b, c, d) {
        if (b) {
            c = c || "Loading...";
            var e = "undefined" != typeof d ? d ? "block": "none": "block",
            f = '<div id="iLoading_overlay" class="window_dialog window_load" style="display: ' + e + ';"><div class="loading_box" style="display: block; opacity: 1;"><div class="dot_box"><span class="s_01"></span><span class="s_02"></span></div><p>' + c + "</p></div></div>";
            if (loadingLayer = function() {
                return m.layer({
                    type: 1,
                    title: !1,
                    closeBtn: !1,
                    shade: [.5, "#000", !1],
                    border: [0, 0, "#fff", !0],
                    area: ["auto", "auto"],
                    offset: ["0px", "0px"],
                    page: {
                        html: f
                    },
                    success: function() {
                        n.isClickShadeHide && m("#iLoading_overlay").click(function() {
                            m(this).hide()
                        })
                    }
                })
            },
            window.ontouchmove = a, -9999 == t) t = loadingLayer();
            else {
                try {
                    layer.close(t)
                } catch(g) {}
                t = loadingLayer()
            }
        } else {
            window.ontouchmove = null;
            try {
                layer.close(t)
            } catch(g) {}
            t = -9999
        }
    }
    function g(a, b) {
        b = b ? b: {};
        var c = b.width,
        d = b.height,
        e = b.offsetX,
        f = b.offsetY;
        return u = m.layer({
            type: 1,
            title: !1,
            closeBtn: !1,
            border: [5, .5, "", !0],
            area: [c ? c: "310px", d ? d: "auto"],
            offset: [f ? f: .3 * m(window).height() + "px", e ? e: ""],
            page: {
                html: a
            }
        })
    }
    function h() {
        if ( - 9999 != s) {
            try {
                layer.close(s)
            } catch(a) {}
            s = -9999
        }
    }
    function i() {
        if ( - 9999 != u) {
            try {
                layer.close(u)
            } catch(a) {}
            u = -9999
        }
    }
    function j() {
        if ( - 9999 != p) {
            try {
                layer.close(p)
            } catch(a) {}
            p = -9999
        }
        if ( - 9999 != q) {
            try {
                layer.close(q)
            } catch(a) {}
            q = -9999
        }
        if ( - 9999 != s) {
            try {
                layer.close(s)
            } catch(a) {}
            s = -9999
        }
        if ( - 9999 != u) {
            try {
                layer.close(u)
            } catch(a) {}
            u = -9999
        }
    }
    function k(a) {
        var b = 0;
        switch (a += "") {
        case "0":
            b = u;
            break;
        case "1":
            b = p;
            break;
        case "2":
            b = q;
            break;
        case "3":
            b = r;
            break;
        case "4":
            b = s;
            break;
        case "5":
            b = t;
            break;
        default:
            b = -9999
        }
        return b
    }
    function l(a) {
        var b = [];
        a instanceof Array ? b = b.concat(a) : a && b.push(a);
        for (var c = 0,
        d = b.length; d > c; c++) {
            var e = document.createElement("link");
            e.charset = "utf-8",
            e.rel = "stylesheet",
            e.href = b[c],
            document.querySelector("head").appendChild(e)
        }
    }
    var m = jQuery = require("jquery"),
    n = require("gconfig"),
    o = n.layerTheme,
    p = -9999,
    q = -9999,
    r = -9999,
    s = -9999,
    t = -9999,
    u = -9999,
    v = null;
    l(n.seaBaseUrl + n.frameworkVersion + "/plugins/layer/css/layer.css"),
    "default" != o && l(n.seaBaseUrl + n.frameworkVersion + "/plugins/layer/css/theme/" + o + ".css");
    var w = {
        iAlert: b,
        iConfirm: c,
        iMsg: d,
        iTips: e,
        iLoading: f,
        layerCustom: g,
        iTipsClose: h,
        iCustomClose: i,
        iLayerClose: j,
        getLayerIdx: k
    };
    module.exports = w
});
/*创建时间 2015-07-27 20:32:39 PM */