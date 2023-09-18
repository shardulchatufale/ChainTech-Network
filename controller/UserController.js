const userModel = require('../module/userModule')
const validator = require("../validation/validation")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userRegister = async function (req, res) {
    try {
        let data = req.body
        let { fname, lname, email, phone, password, address } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

        if (!fname) return res.status(400).send({ status: false, message: 'Please enter first name' })
        if (!validator.isValid(fname)) return res.status(400).send({ status: false, message: 'Please enter first name in right formate' })
        if (!validator.isValidName(fname)) return res.status(400).send({ status: false, message: "Please enter first name in right formate" })

        if (!lname) return res.status(400).send({ status: false, message: 'Please enter lname' })
        if (!validator.isValid(lname)) return res.status(400).send({ status: false, message: 'Please enter last name in right formate' })
        if (!validator.isValidName(lname)) return res.status(400).send({ status: false, message: "Please enter last name in right formate" })

        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })

        if (!phone) return res.status(400).send({ status: false, message: 'Please enter phone' })
        if (!validator.isValidPhone(phone)) return res.status(400).send({ status: false, message: 'Please enter a valid phone number' })

        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: 'Password should be between 8 to 15 character[At least One Upper letter, one small letter, one number and one special charater]' })

        const bcryptPassword = await bcrypt.hash(password, 10)
        data.password = bcryptPassword

        const emailUnique = await userModel.findOne({ email })
        if (emailUnique) return res.status(400).send({ status: false, message: 'Already register Email' })

        const phoneUnique = await userModel.findOne({ phone })
        if (phoneUnique) return res.status(400).send({ status: false, message: "Already register Phone Number" })

        const user = await userModel.create(data)
        return res.status(201).send({ status: true, message: 'User Created Successfully', data: user })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}



//===========================[User Login API]==========================


const userLogin = async function (req, res) {
    let data = req.body
    let { email, password } = data

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

    if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
    if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })

    if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })

    const Login = await userModel.findOne({ email })
    if (!Login) return res.status(400).send({ status: false, message: 'Not a register email Id' })

    //----------[Password Verification]
    let PassDecode = await bcrypt.compare(password, Login.password)
    if (!PassDecode) return res.status(401).send({ status: false, message: 'Password not match' })

    //----------[JWT token generate]
    let token = jwt.sign({
        userId: Login._id.toString()
    }, "GroupNumber4", { expiresIn: '50d' })

    res.setHeader("x-api-key", token)

    return res.status(200).send({ status: true, message: 'User login successfull', data: { userId: Login._id, token: token } })
}

module.exports.userRegister=userRegister













































// 9310025022,9804217634