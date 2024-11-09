const table = document.querySelector('.table')
const firstOp = document.querySelector('#first-operator')
const secondOp = document.querySelector('#second-operator')
const inp1 = document.querySelector('#op1')
const inp2 = document.querySelector('#op2')
const enter = document.querySelector('#enter')
const guide = document.querySelector('h3')


function dec2bin(dec) {
    let result = '';
    while (dec > 0) {
        result = (dec % 2) + result;
        dec = Math.floor(dec / 2);
    }
    return result
}

function insertSpaceEvery6Chars(str) {
    let result = "";
    for (let i = 0; i < str.length; i += 6) {
      result += str.slice(i, i + 6) + " ";
    }
    return result.trim();
  }

function renderHead(op1, op2) {
    table.innerHTML = `
        <div class="row">
            <div class="blank">

            </div>
            <div class="multiplicand">
                Số bị nhân Multiplicand
            </div>
            <div class="product-multiplier">
                Tích/số nhân product/multiplier
            </div>
        </div>
        <div class="row">
            <div class="blank init">
                Khởi tạo
            </div>
            <div id="fisrt-operator" class="multiplicand">
                ${op1}
            </div>
            <div id="second-operator" class="product-multiplier">
                ${op2}
            </div>
        </div>
    `
}

function replace(str, index, char) {
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        if (i !== index) newStr += str[i]
        else newStr += char
    }
    return newStr
}

function addBin(sou, des) {
    let op1 = sou
    let op2 = des
    let mem = 0
    for (let i = 5; i >= 0; i--) {
        if (op1[i] === '0' && op2[i] === '0') {
            if (mem == 0) {
                continue
            } else {
                op2 = replace(op2, i, '1')
                mem = 0
            }
        } else if (op1[i] === '1' && op2[i] === '1') {
            if (mem == 0) {
                op2 = replace(op2, i, '0')
                mem = 1
            } else {
                op2 = replace(op2, i, '1')
                mem = 1
            }
        } else {
            if (mem == 0) {
                op2 = replace(op2, i, '1')
            } else {
                op2 = replace(op2, i, '0')
                mem = 1
            }
        }
    }
    return op2
}

function pushZero(str) {
    let newStr = ''
    newStr += '0'
    for (let i = 0; i < str.length - 1; i++) {
        newStr += str[i]
    }
    return newStr
}

function focusLast(str) {
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        if (i == 10) {
            newStr += str[i] + '['
        } else if (i == 11) {
            newStr += str[i] + ']'
        } else {
            newStr += str[i]
        }
    }
    return newStr
}

function solve(first, second) {
    table.innerHTML = ""

    const num1 = first
    const num2 = second

    let op1 = ''
    for (let i = 0; i < 6 - dec2bin(num1).length; i++) {
        op1 += '0'
    }
    op1 += dec2bin(num1)

    let op2 = ''
    for (let i = 0; i < 12 - dec2bin(num2).length; i++) {
        op2 += '0'
    }
    op2 += dec2bin(num2)

    renderHead(op1, op2)

    for (let i = 0; i < 6; i++) {
        let textStep = ''
        let prod = ''
        if (op2[11] == '0') {
            textStep = `Bước ${i+1}:<br/>multiplier0 = 0<br/>dịch phải [product/multiplier] 1 bit`
            prod = `
                <br/>
                ${focusLast(op2)}
                <br/>
                ${pushZero(op2)}
            `
            op2 = pushZero(op2)
        } else {
            textStep = `Bước ${i+1}:<br/>multiplier0 = 1<br/>product = product + multiplicand<br/>dịch phải [product/multiplier] 1 bit`
            prod = `
                <br/>
                ${focusLast(op2)}
                <br/>
                ${addBin(op1, op2)}
                <br/>
                ${pushZero(addBin(op1, op2))}
            `
            op2 = addBin(op1, op2)
            op2 = pushZero(op2)
        }

        const row = document.createElement('div')
        row.classList.add('row')  
        row.innerHTML = `
            <div class="blank">
                <div class="loop-col">
                    ${i == 0 ? 'Lặp 6 bước': ''}
                </div>
                <div class="step">
                    ${textStep}
                </div>
            </div>
            <div class="multiplicand">
                ${op1}
            </div>
            <div class="product-multiplier">
                ${prod}
            </div>
        `
        table.appendChild(row)
    }
    addBin(op1, op1)
}

enter.onclick = () => {
    if (Number.parseInt(inp1.value) < 0 || Number.parseInt(inp2.value) < 0 || Number.parseInt(inp1.value) > 63 || Number.parseInt(inp2.value) > 63) {
        alert('M khỏi :)))')
    } else {
        table.classList.add('show')
        guide.classList.add('hide')
        solve(Number.parseInt(inp1.value), Number.parseInt(inp2.value))
    }
}