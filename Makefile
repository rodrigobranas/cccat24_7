dev:
	cd backend/account && npm run dev & \
	cd backend/order && npm run dev & \
	cd backend/matching-engine && npm run dev & \
	cd backend/api-gateway && npm run dev & \
	cd backend/projection && npm run dev & \
	wait
