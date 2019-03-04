/**
 * author:nero
 * version:v1.1
 * plugin:code-keeper
 */
const r = require('repl')

class repl {
    init() {
        return r.start({ prompt: '', eval: this.initEval })
    }

    start() {
        return r.start({ prompt: '> ', eval: this.myEval })
    }

    initEval(cmd, context, filename, callback) {
        let myvar = global.myvari
        let anslist = myvar.anslist
        let indx = -1
        for (let i in anslist) {
            if (typeof (anslist[i]) === 'string') {
                if (anslist[i] === cmd.trim()) indx = i
            } else {
                if (Object.keys(anslist[i])[0] === cmd.trim()) indx = i
            }
        }
        if (indx === -1) {
            console.log('Please enter y or n!!!'.red)
        } else {
            myvar.anslist = []
            typeof (anslist[indx]) === 'string' ? myvar.answer[anslist[indx]]() : myvar.answer[Object.values(anslist[indx])]()
        }
    }

    myEval(cmd, context, filename, callback) {
        let myvar = global.myvari
        // temp handle model
        if (myvar.temphandle) {
            myvar.answer[myvar.temphandle](cmd.trim())
            myvar.temphandle = false
        } else {
            let anslist = myvar.anslist
            let indx = -1
            for (let i in anslist) {
                if (typeof (anslist[i]) === 'string') {
                    if (anslist[i] === cmd.trim()) indx = i
                } else {
                    if (Object.keys(anslist[i])[0] === cmd.trim()) indx = i
                }
            }
            if (indx === -1) {
                console.log('Invalid keyword!!!'.red)
            } else {
                myvar.anslist = []
                typeof (anslist[indx]) === 'string' ? myvar.answer[anslist[indx]]() : myvar.answer[Object.values(anslist[indx])]()
            }
        }

        this.displayPrompt()
    }
}

module.exports = repl