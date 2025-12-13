function sleep(time) {
    let endTime = new Date().getTime() + time
    while(true){
        if (new Date().getTime() > endTime){
            return;
        }
    }
}

function sleepToast(text, second) {
    let {java} = this
    java.log(text)
    java.longToast(text)
    if (second === undefined) {second = 0.01}
    this.sleep(1000*second)
}
