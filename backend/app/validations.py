def validate_transaction_amount(amount: float):
    if amount <= 0:
        raise ValueError("Transaction amount must be positive.")
    return amount

def validate_transaction_type(category: str):
    valid_types = {"income", "expense", "transfer"}
    if category.lower() not in valid_types:
        raise ValueError(f"Transaction type must be one of {valid_types}.")
    return category.lower().capitalize()

def validate_username(username: str):
    if len(username) < 3 or len(username) > 25:
        raise ValueError("Username must be between 3 and 25 characters long.")
    if not username.isalnum():
        raise ValueError("Username must be alphanumeric.")
    return username

def validate_password(password: str):
    if len(password) < 6:
        raise ValueError("Password must be at least 6 characters long.")
    return password