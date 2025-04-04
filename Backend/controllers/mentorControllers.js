const bcrypt = require('bcrypt');
const Mentor = require('../models/mentor');
const MentorshipSession = require('../models/mentorshipSession')
const jwt = require('jsonwebtoken')
const { signUpSchema } = require('../helper/validation');


//signup logic
exports.signUpMentor = async (req, res) => {
    try {
        const { error } = signUpSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                msg: error.details[0].message
            }) 
        }
        const { firstName, lastName , email, password ,address , bio , occupation , expertise } = req.body;
        const userInfo = await User.findOne({ email: email })
        if (userInfo) {
            return res.status(400).json({
                message: "Email already registered."
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        try {
            const mentor = await Mentor.create({
                firstName: firstName,
                lastName : lastName ,
                email: email,
                password: hashPassword,
                address: address,
                bio: bio,
                occupation: occupation,
                expertise : expertise 
            })
    
            return res.status(200).json({
                msg: "success",
                data: { mentor }
            })
        } catch (error) {
            if(error.code === 11000){
                res.status(409).json({message:"mentor name already in use"})
            }
            res.status(500).json({message : "internal server error"})
        }
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error, please try again"
        })
    }
}
// login logic
exports.loginMentor = async(req,res) =>{
    const {email , password} = req.body
    try {
        const mentor = await Mentor.findOne({email: email})
        if(!mentor){
            return res.json({message : 'mentor not found'})
        }
        const isAuthenticated  = await bcrypt.compare(password, mentor.password)
        if(!isAuthenticated){
            return res.json({message : "invalid password"})
        }
        const mentorToken = jwt.sign({mentorId : mentor._id},process.env.JWT_SECRET)
        res.cookie('mentorToken',mentorToken,{httpOnly:true})
        res.status(200).json({msg: "success"})
    } catch (error) {
        res.status(500).json({message : 'internal server error '})
    }
}
//get pending sessions
exports.getPendingSessions = async (req,res)=>{
    const mentorToken = req.cookies.mentorToken
    const verifiedMentor = jwt.verify(mentorToken,process.env.JWT_SECRET)
    const mentorId = verifiedMentor.mentorId
    try {
        const pendingSessions = MentorshipSession.findById({
            mentorId: mentorId,
            status: "pending"
        })
        res.status(200).json({pending : pendingSessions})
    } catch (error) {
        console.log(error)
    }
}
//






//logging out
exports.logout = (req,res) =>{
    res.clearCookie('mentoToken')
    res.json({redirect :'/mentor/login'})
}
