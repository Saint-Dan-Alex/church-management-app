<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Code de sécurité</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #ec4899; /* Pink color matching theme */
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 30px;
            text-align: center;
            color: #333333;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 5px;
            color: #ec4899;
            background-color: #fce7f3;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            display: inline-block;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #888888;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Authentification Sécurisée</h1>
        </div>
        <div class="content">
            <p>Bonjour,</p>
            <p>Voici votre code de vérification pour vous connecter :</p>
            
            <div class="code">{{ $code }}</div>
            
            <p>Ce code est valable pendant 10 minutes.</p>
            <p>Si vous n'avez pas tenté de vous connecter, vous pouvez ignorer cet email en toute sécurité.</p>
        </div>
        <div class="footer">
            <p>Ceci est un message automatique, merci de ne pas y répondre.</p>
        </div>
    </div>
</body>
</html>
