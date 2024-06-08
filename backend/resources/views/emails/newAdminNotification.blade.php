<!DOCTYPE html>
<html>

<head>
    <title>Welcome to the Meraki Admin Team</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }

        .container {
            max-width: 600px;
            width: 100%;
            margin: 20px auto;
            padding: 20px;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
        }

        .header h1 {
            font-size: 28px;
            margin: 0;
        }

        .content {
            padding: 20px;
            color: #333333;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin: 15px 0;
        }

        .content ul {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }

        .content ul li {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .content ul li strong {
            font-weight: bold;
        }

        .button {
            display: inline-block;
            padding: 12px 25px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }

        .button:hover {
            background-color: #0056b3;
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #777777;
            font-size: 14px;
            border-radius: 10px 10px;
            background-color: #f4f4f4;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the Meraki Admin Team</h1>
        </div>
        <div class="content">
            <p>Dear {{ $details['first_name'] }},</p>
            <p>
                Congratulations! You have been granted admin access to our
                application.
            </p>
            <p>Here are your login details:</p>
            <ul>
                <li><strong>Email:</strong> {{ $details['email'] }}</li>
                <li><strong>Password:</strong> {{ $details['password'] }}</li>
            </ul>
            <p>
                Please make sure to change your password after logging in for the
                first time.
            </p>
            <p>
                We are excited to have you on the team and look forward to working
                with you.
            </p>
            <p>Best regards,</p>
            <p>The Meraki Team</p>
            <a href="http://yourappurl.com/login" class="button"
                style="display: inline-block; padding: 12px 25px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; text-align: center; margin-top: 20px; transition: background-color 0.3s ease;">Login
                to App</a>
        </div>
        <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
        </div>
    </div>
</body>

</html>