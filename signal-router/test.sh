#!/bin/bash
# Test Script for Signal Routing Authority
# Tests all endpoints after deployment

if [ -z "$1" ]; then
    echo "Usage: ./test.sh <SERVICE_URL>"
    echo "Example: ./test.sh https://signal-router-abc123-uc.a.run.app"
    exit 1
fi

SERVICE_URL="$1"

echo "🧪 Testing Signal Routing Authority"
echo "Service URL: $SERVICE_URL"
echo ""

# Test 1: Health Check
echo "1️⃣ Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$SERVICE_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo "   ✅ Health check passed"
    echo "   Response: $HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo "   ❌ Health check failed"
    echo "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Root Endpoint
echo "2️⃣ Testing root endpoint..."
ROOT_RESPONSE=$(curl -s "$SERVICE_URL/")
if echo "$ROOT_RESPONSE" | grep -q "Signal Routing Authority"; then
    echo "   ✅ Root endpoint passed"
    echo "   Response: $ROOT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$ROOT_RESPONSE"
else
    echo "   ❌ Root endpoint failed"
    echo "   Response: $ROOT_RESPONSE"
fi
echo ""

# Test 3: Academic Signal Endpoint (GET)
echo "3️⃣ Testing academic signal endpoint (GET)..."
ACADEMIC_GET=$(curl -s "$SERVICE_URL/signals/academic")
if echo "$ACADEMIC_GET" | grep -q "academic"; then
    echo "   ✅ Academic GET passed"
    echo "   Response: $ACADEMIC_GET" | python3 -m json.tool 2>/dev/null || echo "$ACADEMIC_GET"
else
    echo "   ❌ Academic GET failed"
    echo "   Response: $ACADEMIC_GET"
fi
echo ""

# Test 4: GitHub Signal Endpoint (GET)
echo "4️⃣ Testing github signal endpoint (GET)..."
GITHUB_GET=$(curl -s "$SERVICE_URL/signals/github")
if echo "$GITHUB_GET" | grep -q "github"; then
    echo "   ✅ GitHub GET passed"
else
    echo "   ❌ GitHub GET failed"
fi
echo ""

# Test 5: Financial Signal Endpoint (GET)
echo "5️⃣ Testing financial signal endpoint (GET)..."
FINANCIAL_GET=$(curl -s "$SERVICE_URL/signals/financial")
if echo "$FINANCIAL_GET" | grep -q "financial"; then
    echo "   ✅ Financial GET passed"
else
    echo "   ❌ Financial GET failed"
fi
echo ""

# Test 6: Invalid Signal Type
echo "6️⃣ Testing invalid signal type..."
INVALID_RESPONSE=$(curl -s "$SERVICE_URL/signals/invalid")
if echo "$INVALID_RESPONSE" | grep -q "Invalid signal type"; then
    echo "   ✅ Error handling works correctly"
else
    echo "   ⚠️  Unexpected response for invalid signal type"
fi
echo ""

# Test 7: POST to Academic Signal (will fail if no real endpoint configured)
echo "7️⃣ Testing POST to academic signal..."
POST_RESPONSE=$(curl -s -X POST "$SERVICE_URL/signals/academic" \
    -H "Content-Type: application/json" \
    -d '{"test": "data", "source": "test_script", "timestamp": "2025-12-04"}')

echo "   Response: $POST_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$POST_RESPONSE"
echo ""

echo "🏁 Testing complete!"
echo ""
echo "📡 Your permanent webhook endpoints:"
echo "   🎓 Academic:  $SERVICE_URL/signals/academic"
echo "   🐙 GitHub:    $SERVICE_URL/signals/github"
echo "   💰 Financial: $SERVICE_URL/signals/financial"
echo ""
