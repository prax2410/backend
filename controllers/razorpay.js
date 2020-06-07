const app = require("express");
const path = require("path");
const shortid = require("shortid");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
	key_id: "rzp_test_fUYsuxleH449XZ",
	key_secret: "3woC9JbzxbDMfROjk14ysG8x"
});

app.get("/Logo.png", (req, res) => {
	res.sendFile(path.join(__dirname, "Logo.png"));
});

app.post("/verification", (req, res) => {
	// do a validation
	const secret = "12345678";

	console.log(req.body);

	const crypto = require("crypto");

	const shasum = crypto.createHmac("sha256", secret);
	shasum.update(JSON.stringify(req.body));
	const digest = shasum.digest("hex");

	console.log(digest, req.headers["x-razorpay-signature"]);

	if (digest === req.headers["x-razorpay-signature"]) {
		console.log("request is legit");
		// process it
		require("fs").writeFileSync("payment1.json", JSON.stringify(req.body, null, 4));
	} else {
		// pass it
	}
	res.json({ status: "ok" });
});

// add async before (req, res)
app.post("/razorpay", (req, res) => {
	const payment_capture = 1;
	const amount = 499;
	const currency = "INR";

	const options = {
		amount: amount,
		currency,
		receipt: shortid.generate(),
		payment_capture
	};

	try {
		const response = razorpay.orders.create(options);
		console.log(response);
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		});
	} catch (error) {
		console.log(error);
	}
});

app.listen(3000, () => {
	console.log("Listening on 3000");
});
