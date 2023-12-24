// const { ConstructionOutlined } = require('@mui/icons-material');
const Feature = require('../models/register');
const summary = require('../models/summary');
const axios = require('axios');
const User = require('../models/user');
require('dotenv').config();
// const { Client } = require('@elastic/elasticsearch');
const getUser = async (req, res) => {
  const keyword = req.body.searchTerm;
  // console.log(req.body);
  try {
    const searchResults = await User.find({
      $and: [
        { adminid: req.body.adminid }
      ]
    });
    searchResults.reverse();
    res.json(searchResults);
    // console.log(searchResults);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}

// const client = new Client({
//   node: process.env.ELASTIC_SERVER_URL,
//   auth: {
//     username: process.env.ELASTIC_USERNAME,
//     password: process.env.ELASTIC_PASSWORD
//   },
//   ssl: {
//     rejectUnauthorized: false
//   }
// });
// const getUser = async(req,res)=>{
//   console.log(process.env.ELASTIC_PASSWORD)
//   console.log(req.body);
//   try {
//     const { body } = await client.search({
//       index: 'bjp',
//       body: {
//         query: {
//           query_string: {
//             fields: ['*'],
//             query: `*${req.body.searchTerm}*`,
//           },
//         },
//         highlight: {
//           fields: {
//             "*": {}
//           }
//         }   
//       },
//     });
//     const hits = body.hits.hits;
//     // console.log(hits);
//     var arr=[]
//     if (hits.length > 0) {
//       arr = hits.map(hit => {
//         const fieldsObj = {};

//         Object.entries(hit._source).forEach(([field, value]) => {
//           fieldsObj[field] = value;
//         });

//         return fieldsObj;
//       });

//       console.log(arr);        
//     } 
//     res.json(arr);
//     // res.json(results);
//   } catch (error) {
//     console.error('Error searching in Elasticsearch:', error);
//     res.status(500).json({ error: 'An error occurred while searching' });
//   }
// }


const postRegister = async (req, res) => {
  const { user, mobile, email, posting, dob, password, location, msgCount } = req.body
  // console.log(req.body);
  try {
    const existingUser = await Feature.findOne({ user: user });
    if (existingUser) {

      res.status(204).json({ message: 'User exists' });
    }
    else {
      const { token, tokenCreated } = await generateToken();
      const feature = await Feature.create({
        user,
        mobile,
        email,
        posting,
        dob,
        password,
        location,
        msgCount,
        token,
        tokenCreated,
      });

      res.status(200).json(feature);
      // console.log("user registered");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);

  }
}

const postUser = async (req, res) => {
  const { name, phone, adminid, state, district, area } = req.body;
  // console.log(req.body);
  try {
    const existingUser = await User.findOne({ phone: phone, adminid: adminid });
    // console.log(existingUser);
    if (existingUser) {
      // console.log("1");
      res.status(200).json({ message: 'User exists' });
    }
    else {
      // console.log("2");
      const feature = await User.create({ name, phone, state, district, area, adminid })
      res.status(200).json({ message: 'User Added Successfully' });
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: error });
  }
}
const check = async (req, res) => {

  try {
    const { username, password } = req.body;
    // console.log(req.body);
    let user1 = await Feature.findOne({ user: username });
    // console.log(user1);
    if (!user1) {
      return res.status(200).json({ message: 'false_user' }); // User not found
    }

    if (user1.password === password) {
      return res.status(200).json({ message: 'true' });// Authentication succes
    } else {
      return res.status(200).json({ message: 'false_password' }); // User not found
    }
  }
  catch (error) {
    res.status(400).json({ message: 'error' });
  }
}
const postSummary = async (req, res) => {
  try {
    const { user, videoid, selectedData, tag, message, filepath } = req.body;
    // console.log(req.body);
    try {
      const Summary = await summary.create({ user, tag, videoid, selectedData, message, filepath });
      Summary.save;
      res.status(200).json(summary);
      // console.log(true);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
}
const getSummary = async (req, res) => {
  try {
    // console.log(req.params.user);
    const summaries = await summary.find({ user: req.params.user }); // Retrieve all summaries from the database
    const formatttedSummary = summaries.map(item => ({
      ...item._doc,
      dateCreated: new Date(item.dateCreated).toLocaleDateString('en-IN')
    }));
    res.json(formatttedSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching summaries' });
  }
};
const getProfile = async (req, res) => {
  try {
    const username = req.params.user;

    // Find the user in the database based on the username
    const user = await Feature.findOne({ user: username });
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // const formatttedProfile = user.map(item => ({
    //   ...item._doc,
    //   dob: item.dob.toLocaleDateString('en-IN')
    // }));
    // console.log(user);
    res.status(200).json(user); // Return the user object in the response
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}
const updateProfile = async (req, res) => {
  const updateData = req.body;
  const user = req.params.user;
  // console.log(updateData);

  try {
    const updatedUser = await Feature.findOneAndUpdate({ user: user }, updateData, { new: true });
    // console.log(updatedUser);
    res.status(200).json({ message: "Admin Updated" });
  }
  catch (error) {
    res.status(500).json({ error: 'Error updating user data' });
  }
}
const forgotpassword = async (req, res) => {
  try {
    // console.log(req.body);
    const username = req.params.user;
    const updateData = req.body;
    const existingUser = await Feature.findOne({ user: username });

    if (existingUser) {

      const updatedUser = await Feature.findOneAndUpdate({ user: username }, updateData, { new: true });
      // console.log(updatedUser);
      res.status(200).json({ message: 'User exists' });

    } else {
      res.status(204).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }



}
const getReport = async (req, res) => {
  try {
    const { fromdate, todate } = req.params;
    const fromDate = new Date(fromdate);
    const toDate = new Date(todate);
    // console.log(fromdate);
    fromDate.setHours(0, 0, 0, 0);
    // Set time to the end of the specified day
    toDate.setHours(23, 59, 59, 999);
    // console.log(req.params.user);
    // console.log(fromDate);
    // console.log(toDate);
    const reports = await summary.find({
      dateCreated: {
        $gte: fromDate,
        $lte: toDate
      },
      user: req.params.user,
    });
    const formattedReports = reports.map(item => ({
      ...item._doc,
      dateCreated: new Date(item.dateCreated).toLocaleDateString('en-IN')
    }));

    // console.log(reports);
    // console.log(formattedReports);
    // Send the formatted data as JSON response
    res.json(formattedReports.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Error while fetching reports', error: error.message });
  }
};
const whatsApp = async (re, res) => {
  try {
    const { productId, phoneId, toNumber, type, message } = re.body;

    const req = unirest("POST", `https://api.maytapi.com/api/${productId}/${phoneId}/sendMessage`);

    req.headers({
      "x-maytapi-key": "c525ca7e-a9c4-437c-baaa-9bebda8711ac",
      "content-type": "application/json"
    });

    req.type("json");
    req.send({
      "to_number": toNumber,
      "type": type,
      "message": message
    });

    const resData = await req.execute();

    if (resData.error) {
      throw new Error(resData.error);
    }

    res.send(resData.body);
  }
  catch (error) {
    res.status(500).json({ message: 'Error while fetching reports', error: error.message });
  }
}

const generateToken = async () => {
  try {
    // Replace 'YOUR_API_URL' with the actual API endpoint
    const apiUrl = 'https://api.wfgateway.com/api/v1/user/login';

    // Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD' with the actual credentials
    const requestData = {
      username: 'logeshwaran@mannit.co',
      password: 'Awrw6jBCoSX91js',
    };

    // Make a POST request to the API
    const response = await axios.post(apiUrl, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the API response as needed
    // console.log(response.data);
    console.log(response.data);
    // Return the generated token and timestamp  as milliseconds since Unix epoch
    return { token: response.data.data.token, tokenCreated: Date.now() };
  } catch (error) {
    // Handle errors
    console.error(error);
    throw new Error('Failed to generate token');
  }
};

const updateToken = async (user) => {
  try {
    const lastTokenTime = new Date(user.tokenCreated);
    const sixHoursLater = new Date(lastTokenTime.getTime() + 6 * 60 * 60 * 1000);
    const currentTime = new Date();

    const formatTime = (time) => time.toISOString().slice(0, -1);

    // console.log(formatTime(currentTime));
    // console.log(formatTime(sixHoursLater));

    if (formatTime(currentTime) > formatTime(sixHoursLater)) {
      const { token, tokenCreated } = await generateToken();
      user.token = token;
      user.tokenCreated = tokenCreated;
      await user.save();
      return user.token;
      console.log(1);
    }
    else if (currentTime - formatTime(user.tokenCreated) < formatTime(sixHoursLater)) {
      console.log("token still not expired");
      return user.token;
    }
  }
  catch (error) {
    console.error(error);
    throw new Error('Failed to update token');
  }
}

const updateUserToken = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Fetch the user from the database using the userId
    const user = await Feature.findOne({ user: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await updateToken(user);
    res.status(200).json({ message: 'Token updated successfully', token: user.token });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
const bulkupload = async (req, res) => {
  try {
    const { data, adminid } = req.body;
    // Assuming you have a User model and want to save each record
    // in the `data` array to the database
    // console.log(data);
    for (const record of data) {
      const { name, phone, state, district, area } = record;
      const phoneRegex = /^[2-9]\d{9}$/;
      const isValidPhone = phoneRegex.test(phone);
      // const existingUser = await User.findOne({ phone: phone, adminid: adminid });
      if (isValidPhone) {
        const existingUser = await User.findOne({ phone: phone, adminid: adminid });
        // console.log(existingUser);
        if (!existingUser) {
          const newUser = new User({ name, phone, adminid, state, district, area });
          await newUser.save();
        }
      } else {
        console.log(`Invalid phone number: ${phone}`);
        // Handle invalid phone number (e.g., log, skip the record, or throw an error)
      }
    }
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error saving data' });
  }
}
const changepassword = async (req, res) => {
  try {
    // console.log(req.body);
    const username = req.params.user;
    const { password, newpassword } = req.body;
    const existingUser = await Feature.findOne({ user: username });

    if (existingUser) {
      const isPasswordValid = existingUser.password === password;

      if (isPasswordValid) {
        // Update the password with the new password from the request body
        existingUser.password = newpassword;
        await existingUser.save();
        // console.log(existingUser);
        res.status(200).json({ message: 'Password updated successfully' });
      } else {
        // Password doesn't match, send an error message
        // console.log(1);
        // console.log("Invalid Password");
        res.status(401).json({ message: 'Invalid password' });
      }

    } else {
      // User not found
      res.status(204).json({ message: 'User not found' });
    }

  }
  catch (error) {

  }
}
const updateMsgCount = async (req, res) => {
  try {
    const username = req.params.user;
    const updateData = req.body;
    const record = await Feature.findOneAndUpdate({ user: username }, updateData, { new: true });
    res.status(200).json({ message: 'msgCount updated' });
  }
  catch (error) {
    res.status(500).json({ error: error });
  }
}
module.exports = {
  postRegister,
  check,
  postSummary,
  getSummary,
  getUser,
  getProfile,
  updateProfile,
  forgotpassword,
  getReport,
  whatsApp,
  postUser,
  bulkupload,
  updateMsgCount,
  generateToken,
  updateUserToken,
  changepassword
}
