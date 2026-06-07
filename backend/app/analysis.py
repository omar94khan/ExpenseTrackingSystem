import pandas as pd
from sqlalchemy.inspection import inspect


def model_to_dict(obj):
    return {c.key: getattr(obj, c.key) for c in inspect(obj).mapper.column_attrs}

def analyze_report(transactions):
    df = pd.DataFrame([model_to_dict(t) for t in transactions])

    # optional: ensure date is string for JSON and all transaction types are lowercase
    df["date"] = pd.to_datetime(df["date"]).dt.date.astype(str)
    df["transaction_type"] = df["transaction_type"].str.lower()

    # return df
    if df.empty:
        return {"message": "No transactions to analyze."}


    df["date"] = pd.to_datetime(df["date"])

    # month key + display label
    df["month"] = df["date"].dt.to_period("M")          # e.g., 2025-12
    df["month_label"] = df["date"].dt.strftime("%b-%Y") # e.g., Dec-2025

    # aggregate per month
    out = (
        df.groupby("month", as_index=False)
        .agg(
            transaction_month=("month_label", "first"),
            total_income=("amount", lambda s: s[df.loc[s.index, "transaction_type"].eq("income")].sum()),
            total_expense=("amount", lambda s: s[df.loc[s.index, "transaction_type"].eq("expense")].sum()),
            most_common_expense_category=("category", lambda s: (
                df.loc[s.index]
                    .query("transaction_type == 'expense'")["category"]
                    .mode()
                    .iat[0] if (df.loc[s.index, "transaction_type"].eq("expense").any()) else None
            )),
        )
    )

    # optional: sort newest->oldest and use month label as index
    out = out.sort_values("month", ascending=False).drop(columns=["month"]).set_index("transaction_month")

    return out.to_dict(orient="index")