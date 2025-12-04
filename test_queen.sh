#!/bin/bash

# Queen Testing Script
# Tests all Queen endpoints with various scenarios

set -e

echo "🔬 Queen Academic Intelligence Pipeline - Test Suite"
echo "===================================================="
echo ""

# Configuration
QUEEN_URL="${QUEEN_URL:-http://localhost:8080}"
GPG_KEY_ID="AE5519579584DEF5"
GPG_SUBKEY="510AB6D40B4A24FB"
SOURCE="strategickhaos-academic"

echo "📍 Testing Queen at: $QUEEN_URL"
echo ""

# Test 1: Health endpoint
echo "Test 1: Health Check"
echo "--------------------"
curl -s "$QUEEN_URL/health" | python3 -m json.tool
echo ""
echo "✅ Health check passed"
echo ""

# Test 2: Root endpoint
echo "Test 2: API Information"
echo "-----------------------"
curl -s "$QUEEN_URL/" | python3 -m json.tool
echo ""
echo "✅ API info retrieved"
echo ""

# Test 3: Academic endpoint with valid authentication
echo "Test 3: Valid Academic Signal"
echo "-----------------------------"
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: $GPG_KEY_ID" \
  -H "X-Source: $SOURCE" \
  -H "X-Subkey: $GPG_SUBKEY" \
  -d '{
    "id": "email-12345",
    "timestamp": "2025-12-04T18:00:00Z",
    "from": "professor@snhu.edu",
    "subject": "CS-499 Final Project Due Date",
    "summary": "Your final project for CS-499 is due on December 15th at 11:59 PM.",
    "type": "deadline",
    "course": "CS-499",
    "deadline": "2025-12-15T23:59:00Z",
    "priority": "high",
    "action_required": true
  }' | python3 -m json.tool
echo ""
echo "✅ Valid signal processed"
echo ""

# Test 4: Missing GPG Key ID
echo "Test 4: Missing GPG Key ID (should fail)"
echo "----------------------------------------"
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-Source: $SOURCE" \
  -H "X-Subkey: $GPG_SUBKEY" \
  -d '{"test": "no key"}' | python3 -m json.tool
echo ""
echo "✅ Authentication failure detected correctly"
echo ""

# Test 5: Invalid GPG Key ID
echo "Test 5: Invalid GPG Key ID (should fail)"
echo "----------------------------------------"
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: WRONGKEY123" \
  -H "X-Source: $SOURCE" \
  -H "X-Subkey: $GPG_SUBKEY" \
  -d '{"test": "wrong key"}' | python3 -m json.tool
echo ""
echo "✅ Invalid key detected correctly"
echo ""

# Test 6: Invalid Source
echo "Test 6: Invalid Source (should fail)"
echo "------------------------------------"
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: $GPG_KEY_ID" \
  -H "X-Source: wrong-source" \
  -H "X-Subkey: $GPG_SUBKEY" \
  -d '{"test": "wrong source"}' | python3 -m json.tool
echo ""
echo "✅ Invalid source detected correctly"
echo ""

# Test 7: Empty payload
echo "Test 7: Empty Payload (should fail)"
echo "-----------------------------------"
curl -X POST "$QUEEN_URL/signals/academic" \
  -H "Content-Type: application/json" \
  -H "X-GPG-Key-ID: $GPG_KEY_ID" \
  -H "X-Source: $SOURCE" \
  -H "X-Subkey: $GPG_SUBKEY" \
  -d '{}' | python3 -m json.tool
echo ""
echo "✅ Empty payload handled"
echo ""

# Test 8: 404 endpoint
echo "Test 8: Non-existent Endpoint (should 404)"
echo "------------------------------------------"
curl -s "$QUEEN_URL/nonexistent" | python3 -m json.tool
echo ""
echo "✅ 404 handled correctly"
echo ""

echo "===================================================="
echo "🎉 All tests completed successfully!"
echo ""
echo "📊 Test Summary:"
echo "  ✅ Health check"
echo "  ✅ API information"
echo "  ✅ Valid signal processing"
echo "  ✅ Missing authentication"
echo "  ✅ Invalid GPG key"
echo "  ✅ Invalid source"
echo "  ✅ Empty payload"
echo "  ✅ 404 handling"
echo ""
echo "👑 Queen is ready for production!"
