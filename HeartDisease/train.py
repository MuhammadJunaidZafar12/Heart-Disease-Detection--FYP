import pandas as pd
import warnings
import joblib

from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report, roc_auc_score

warnings.filterwarnings("ignore")

# -------------------------------
# 1 LOAD ONLY KAGGLE DATASET
# -------------------------------
df = pd.read_csv("uci_heart.xlsx.csv")

# If target column not present
if "target" not in df.columns:
    df.rename(columns={"num": "target"}, inplace=True)

df.replace("?", pd.NA, inplace=True)

# Convert target
df["target"] = df["target"].apply(lambda x: 1 if float(x) > 0 else 0)

# -------------------------------
# 2 SPLIT FEATURES & TARGET
# -------------------------------
X = df.drop("target", axis=1)
y = df["target"]

# Convert categorical to numeric
X = pd.get_dummies(X)

# -------------------------------
# 3 TRAIN TEST SPLIT
# -------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------------
# 4 MODEL (STACKING)
# -------------------------------
rf = RandomForestClassifier(
    n_estimators=200,
    max_depth=8,
    random_state=42,
    class_weight="balanced"
)

gb = GradientBoostingClassifier(
    n_estimators=200,
    random_state=42
)

stack_model = StackingClassifier(
    estimators=[("rf", rf), ("gb", gb)],
    final_estimator=LogisticRegression(max_iter=1000)
)

# -------------------------------
# 5 PIPELINE (SAFE)
# -------------------------------
model = Pipeline([
    ("imputer", SimpleImputer(strategy="mean")),
    ("clf", stack_model)
])

# -------------------------------
# 6 TRAIN MODEL
# -------------------------------
model.fit(X_train, y_train)

# -------------------------------
# 7 EVALUATION
# -------------------------------
train_pred = model.predict(X_train)
test_pred = model.predict(X_test)

print("Training Accuracy:", accuracy_score(y_train, train_pred))
print("Test Accuracy:", accuracy_score(y_test, test_pred))

print("\nClassification Report:\n")
print(classification_report(y_test, test_pred))

print("ROC-AUC:",
      roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, test_pred))

# -------------------------------
# 8 SAVE MODEL
# -------------------------------
joblib.dump(model, "heart_model.pkl")
joblib.dump(X.columns, "columns.pkl")
#joblib.dump(model, "heart_model.pkl")
#joblib.dump(stack_model, "heart_model.pkl")
#joblib.dump(imputer, "imputer.pkl")
#joblib.dump(feature_columns, "columns.pkl")
# -------------------------------
# 9 SAMPLE PREDICTION
# -------------------------------
sample = pd.DataFrame([{
    "age": 30,
    "sex": 1,
    "cp": 3,
    "trestbps": 150,
    "chol": 220,
    "fbs": 1,
    "restecg": 1,
    "thalach": 200,
    "exang": 1,
    "oldpeak": 2.7,
    "slope": 2,
    "ca": 3,
    "thal": 3
}])

sample = pd.get_dummies(sample)
sample = sample.reindex(columns=X.columns, fill_value=0)

prediction = model.predict(sample)[0]
probability = model.predict_proba(sample)[0][1]

print("\n=== SAMPLE RESULT ===")
print("Prediction:", prediction)
print("Probability:", round(probability * 100, 2), "%")





# import pandas as pd
# import matplotlib.pyplot as plt
# import seaborn as sns
# import warnings
# import joblib
# from sklearn.impute import SimpleImputer
# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, StackingClassifier
# from sklearn.linear_model import LogisticRegression
# from sklearn.metrics import accuracy_score, confusion_matrix, roc_curve, auc
#
# warnings.filterwarnings("ignore")
#
# # -------------------------------
# # 1️⃣ Load UCI Cleveland Dataset
# # -------------------------------
# uci_cols = [
#     'id', 'age', 'sex', 'dataset', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
#     'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'num'
# ]
#
# df1 = pd.read_csv(
#     "cleveland.xlsx.csv",
#     names=uci_cols,
#     header=None,
#     encoding='ISO-8859-1'
# )
#
# df1.replace("?", pd.NA, inplace=True)
# df1.drop(columns=["id", "dataset"], inplace=True)
# df1.rename(columns={"num": "target"}, inplace=True)
# df1["target"] = df1["target"].apply(lambda x: 1 if float(x) > 0 else 0)
#
# # -------------------------------
# # 2️⃣ Load Second Dataset (Kaggle)
# # -------------------------------
# df2 = pd.read_csv("uci_heart.xlsx.csv", encoding='ISO-8859-1')
#
# if "target" not in df2.columns:
#     df2.rename(columns={"num": "target"}, inplace=True)
#
# df2.replace("?", pd.NA, inplace=True)
# df2["target"] = df2["target"].apply(lambda x: 1 if float(x) > 0 else 0)
#
# # -------------------------------
# # 3️⃣ Merge Datasets
# # -------------------------------
# merged_df = pd.concat([df1, df2], ignore_index=True)
#
# # -------------------------------
# # 3️⃣.1 Drop 'id' column if exists
# # -------------------------------
# if 'id' in merged_df.columns:
#     merged_df = merged_df.drop(columns=['id'])
#
# # -------------------------------
# # 3️⃣.2 Clean dataset for display (FINAL NaN FIX)
# # -------------------------------
# merged_df_display = merged_df.copy()
#
# # Convert numeric columns
# numeric_cols = ['age', 'trestbps', 'chol', 'thalach', 'oldpeak', 'ca', 'thalch']
# for col in numeric_cols:
#     merged_df_display[col] = pd.to_numeric(merged_df_display[col], errors='coerce')
#
# merged_df_display[numeric_cols] = merged_df_display[numeric_cols].fillna(
#     merged_df_display[numeric_cols].mean()
# )
#
# # Fill categorical NaNs with mode
# categorical_cols = ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'thal', 'dataset']
# for col in categorical_cols:
#     merged_df_display[col] = merged_df_display[col].fillna(merged_df_display[col].mode()[0])
#
# print("Merged dataset shape (cleaned for display):", merged_df_display.shape)
# print(merged_df_display.head())
#
# # -------------------------------
# # 4️⃣ Separate X & y
# # -------------------------------
# X = merged_df.drop("target", axis=1)
# y = merged_df["target"]
#
# # Convert categorical to numeric
# X = pd.get_dummies(X)
# feature_columns = X.columns
# X = X.apply(pd.to_numeric, errors='coerce')
#
# # -------------------------------
# # 5️⃣ Handle missing values
# # -------------------------------
# imputer = SimpleImputer(strategy="mean")
# X = imputer.fit_transform(X)
#
# y = pd.to_numeric(y, errors='coerce')
# y = y.fillna(y.mean())
#
# # -------------------------------
# # 6️⃣ Split dataset
# # -------------------------------
# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )
#
# # -------------------------------
# # 7️⃣ Hybrid Stacking Model
# # -------------------------------
# rf = RandomForestClassifier(n_estimators=200, random_state=42)
# gb = GradientBoostingClassifier(n_estimators=200, random_state=42)
#
# stack_model = StackingClassifier(
#     estimators=[("rf", rf), ("gb", gb)],
#     final_estimator=LogisticRegression(max_iter=1000)
# )
#
# # Train the model
# stack_model.fit(X_train, y_train)
#
# # Save model and preprocessing objects
# joblib.dump(stack_model, "heart_model.pkl")
# joblib.dump(imputer, "imputer.pkl")
# joblib.dump(feature_columns, "columns.pkl")
#
# # -------------------------------
# # Evaluate model
# # -------------------------------
# train_pred = stack_model.predict(X_train)
# train_accuracy = accuracy_score(y_train, train_pred)
# print("Training Accuracy: {:.2f}%".format(train_accuracy * 100))
#
# test_pred = stack_model.predict(X_test)
# test_accuracy = accuracy_score(y_test, test_pred)
# print("Test Accuracy: {:.2f}%".format(test_accuracy * 100))
# print("Hybrid Model Accuracy (Test data): {:.2f}%".format(test_accuracy * 100))
#
# # Confusion matrix
# cm = confusion_matrix(y_test, test_pred)
# sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
# plt.title("Confusion Matrix (Test Data)")
# plt.xlabel("Predicted")
# plt.ylabel("Actual")
# plt.show()
#
# # ROC curve
# y_prob = stack_model.predict_proba(X_test)[:, 1]
# fpr, tpr, _ = roc_curve(y_test, y_prob)
# roc_auc = auc(fpr, tpr)
#
# plt.plot(fpr, tpr, label="AUC = {:.2f}".format(roc_auc))
# plt.plot([0, 1], [0, 1], "--")
# plt.xlabel("False Positive Rate")
# plt.ylabel("True Positive Rate")
# plt.title("ROC Curve (Test Data)")
# plt.legend()
# plt.show()
#
# # -------------------------------
# # User input for prediction
# # -------------------------------
# model = joblib.load("heart_model.pkl")
# imputer = joblib.load("imputer.pkl")
# columns = joblib.load("columns.pkl")
#
# sample = pd.DataFrame([{
#     'age': 30,
#     'sex': 1,
#     'cp': 3,
#     'trestbps': 150,
#     'chol': 220,
#     'fbs': 1,
#     'restecg': 1,
#     'thalach': 200,
#     'exang': 1,
#     'oldpeak': 2.7,
#     'slope': 2,
#     'ca': 3,
#     'thal': 3
# }])
#
# sample = pd.get_dummies(sample)
# sample = sample.reindex(columns=columns, fill_value=0)
# sample = imputer.transform(sample)
#
# pred = model.predict(sample)[0]
# prob = model.predict_proba(sample)[0][1]
#
# from sklearn.metrics import classification_report
#
# print(classification_report(y_test, test_pred))
#
# print("Prediction:", pred)
# print("Probability:", round(prob * 100, 2), "%")
#
# # print("\n====== ENTER PATIENT DETAILS ======\n")
# # age = int(input("Age: "))
# # sex = int(input("Sex (1 = Male, 0 = Female): "))
# # cp = int(input("Chest Pain Type (0-3): "))
# # trestbps = int(input("Resting Blood Pressure: "))
# # chol = int(input("Cholesterol: "))
# # fbs = int(input("Fasting Blood Sugar > 120 (1 = True, 0 = False): "))
# # restecg = int(input("Rest ECG (0-2): "))
# # thalach = int(input("Maximum Heart Rate Achieved: "))
# # exang = int(input("Exercise Induced Angina (1 = Yes, 0 = No): "))
# # oldpeak = float(input("Oldpeak: "))
# # slope = int(input("Slope (0-2): "))
# # ca = int(input("Number of Major Vessels (0-3): "))
# # thal = int(input("Thal (1 = Normal, 2 = Fixed Defect, 3 = Reversible Defect): "))
# #
# # new_patient = {
# #     'age': age, 'sex': sex, 'cp': cp, 'trestbps': trestbps,
# #     'chol': chol, 'fbs': fbs, 'restecg': restecg, 'thalach': thalach,
# #     'exang': exang, 'oldpeak': oldpeak, 'slope': slope, 'ca': ca, 'thal': thal
# # }
# #
# # input_df = pd.DataFrame([new_patient])
# # input_df = pd.get_dummies(input_df)
# # input_df = input_df.reindex(columns=columns, fill_value=0)
# # input_df = imputer.transform(input_df)
# #
# # prediction = model.predict(input_df)[0]
# # probability = model.predict_proba(input_df)[0][1]
# #
# # print("\n====== RESULT ======\n")
# # if prediction == 1:
# #     print("Patient HAS Heart Disease ❌")
# # else:
# #     print("Patient DOES NOT Have Heart Disease ✅")
# # print("Risk Probability:", round(probability * 100, 2), "%")
