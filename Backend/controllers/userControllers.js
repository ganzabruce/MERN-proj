const bcrypt = require('bcrypt');
const User = require('../models/user');
const Mentor = require('../models/mentor');
const jwt = require('jsonwebtoken')
const MentorshipSession = require('../models/mentorshipSession')
const { UserSignUpSchema } = require('../helper/uservalidation');

//signup logic
exports.signUp = async (req, res) => {
    try {
        const { error } = UserSignUpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                msg: error.details[0].message
            }) 
        }
        const { email, password } = req.body;
        const userInfo = await User.findOne({ email: email })
        if (userInfo) {
            return res.status(400).json({
                msg: "Email already registered."
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const user = await User.create({
                email: email,
                password: hashPassword,
            })
    
            return res.status(200).json({
                msg: "success",
                data: { user }
            })
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message:"user already in use"})
            }
            res.status(500).json({message : "internal server error"})
        }

    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error, please try again"
        })
    }
}
//login logic
exports.loginUser = async(req,res) =>{
    const {email , password} = req.body
    try {
        const user = await Mentor.findOne({email: email})
        if(!user){
            return res.json({message : 'user not found'})
        }
        const isAuthenticated  = await bcrypt.compare(password, user.password)
        if(!isAuthenticated){
            return res.json({message : "invalid password"})
        }
        const userToken = jwt.sign({userId : user._id},process.env.JWT_SECRET)
        res.cookie('userToken',userToken,{httpOnly:true})
    } catch (error) {
        res.status(500).json({message : 'internal server error '})
    }
}
//logout logic
exports.logoutUser = (req,res)=>{
    res.clearCookie('userToken')
    res.json({redirect: '/user/login'})
}
//viewing all mentors
exports.getMentors = async (req,res) =>{
    try {
        const allMentors = await Mentor.find()
        res.status(200).json({allMentors : allMentors})
        console.log('sent list of all mentors')
    } catch (error) {
        return res.status(500).json({msg: "internal server error"})
    }
}
//viewing specific mentor
exports.getSpecificMentors = async (req,res) =>{
    const {id} = req.body.id
    try {
        const oneMentors = await Mentor.findById(id)
        res.status(200).json({oneMentors : oneMentors})
        console.log('sent list of all mentors')
    } catch (error) {
        return res.status(500).json({msg: "internal server error"})
    }
}
//requesting mentorship session 
exports.requestSession = async (req,res)=>{
    const {mentorId , menteeId , questions ,menteeEmail , status } = req.body
    try {
        const session = new MentorshipSession({
            mentorId, 
            menteeId, 
            questions,
            menteeEmail,
            status
        })
        await session.create(session)
        res.status(200).json({msg : 'success'})
    } catch (error) {
        console.log(error)
    }
}
//view my pending sessions


exports.viewMySessions = async (req,res) =>{
    const userToken = req.cookies.userToken
    const verifiedUser = jwt.verify(userToken,process.env.JWT_SECRET)
    const userId = verifiedUser.userId
    try {
        const myPending = MentorshipSession.findById({
            _id: userId,
            status: "pending"
        })
        if(!myPending){
            return res.json({msg: "no pending sessions"})
        }
        res.status(200).json({pending:{myPending} })
        console.log('fetched active sessions')
    } catch (error) {
        console.log(error)
    }
}