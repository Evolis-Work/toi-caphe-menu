# Sheet Seed Data

Copy each block into the matching Google Sheet tab.

## Categories tab

```tsv
id	name	icon	order
cat-cafe	Cafe		1
cat-tra	Trà		2
cat-latte	Latte		3
cat-tra-nhiet-oi	Trà Nhiệt Đới		4
cat-tra-sua	Trà Sữa		5
cat-kombucha	Kombucha		6
cat-soda	Soda		7
cat-yogurt	Yogurt		8
cat-nuoc-giai-khat	Nước Giải Khát		9
```

## MenuItems tab

```tsv
id	category	name	temp	price	description	image	available	bestseller	order
item-cafe-ca-phe-en-a-nong-1	Cafe	Cà Phê Đen Đá, Nóng	hot	15000	Đen chuẩn gu người lớn: nóng thì ấm mood, đá thì bật tỉnh táo instant.	/toi-caphe-menu/menu-images/cafe-ca-phe-en-a-nong-734ca9955d.png	true	false	0
item-cafe-cafe-muoi-2	Cafe	Cafe muối	cold	20000	Kem muối mặn mặn béo béo ôm trọn cà phê đậm, cuốn kiểu không lối thoát.	/toi-caphe-menu/menu-images/cafe-cafe-muoi-1bd442ecab.png	true	false	0
item-cafe-cafe-sua-a-3	Cafe	Cafe sữa đá	cold	18000	Ngọt xinh vừa đủ, mát lạnh phát là thấy đời bớt drama.	/toi-caphe-menu/menu-images/cafe-cafe-sua-a-11139f00d3.png	true	true	0
item-cafe-cafe-sua-nong-4	Cafe	Cafe sữa nóng	hot	18000	Ly cà phê “healing” đầu ngày: ấm tay, thơm sữa, tỉnh nhẹ nhàng.	/toi-caphe-menu/menu-images/cafe-cafe-sua-nong-dc809fd1b0.png	true	false	0
item-cafe-cafe-trung-5	Cafe	Cafe trứng	cold	20000	Bông mịn như cloud, thơm như bánh; uống 1 ngụm là dính luôn.		true	false	0
item-tra-tra-chanh-6	Trà	Trà Chanh	cold	15000	Chua thanh mát cổ, cứu khát cực nhanh cho những ngày nắng cháy máy.		true	false	0
item-tra-tra-gung-7	Trà	Trà Gừng	cold	15000	Ấm bụng ấm lòng, dịu cổ họng, hợp hôm trời trở mood lạnh.	/toi-caphe-menu/menu-images/tra-tra-gung-edc002965c.jpg	true	false	0
item-tra-tra-lipton-a-nong-8	Trà	Trà Lipton Đá, Nóng	both	15000	Classic never die: nóng êm êm, đá thì mát rượi, lúc nào cũng hợp.		true	false	0
item-tra-tra-tac-9	Trà	Trà Tắc	cold	15000	Vị tắc thơm nức mũi, chua ngọt tỉnh người, hợp để “reset não”.		true	false	0
item-latte-ca-phe-10	Latte	Cà Phê	cold	25000	Latte cân bằng đỉnh: cà phê đủ lực, sữa đủ êm, gu ai cũng hợp.		true	false	0
item-latte-cacao-11	Latte	Cacao	cold	25000	Cacao ngọt thơm kiểu dễ thương, một ly là mood lên level.		true	false	0
item-latte-matcha-12	Latte	Matcha	cold	25000	Matcha xanh mướt, thơm dịu, uống vào thấy mình sống healthy ngay tức thì.		true	false	0
item-tra-nhiet-oi-tra-dua-luoi-13	Trà Nhiệt Đới	Trà Dưa Lưới	cold	25000	Dưa lưới thơm mịn, mát nhẹ dễ uống, hợp gu chill cuối ngày.		true	false	0
item-tra-nhiet-oi-tra-ao-14	Trà Nhiệt Đới	Trà Đào	cold	25000	Đào thơm mềm, vị trà thanh, sip một cái là thấy “thơ” liền.		true	false	0
item-tra-nhiet-oi-tra-oi-15	Trà Nhiệt Đới	Trà Ổi	cold	25000	Ổi thơm thanh, vị trà nhẹ, uống xong thấy người “fresh” hẳn.		true	false	0
item-tra-nhiet-oi-tra-trai-cay-16	Trà Nhiệt Đới	Trà Trái Cây	cold	25000	Trái cây tươi mát full năng lượng, mỗi ngụm là một tí vacation.		true	false	0
item-tra-nhiet-oi-tra-vai-17	Trà Nhiệt Đới	Trà Vải	cold	25000	Vải ngọt dịu + trà mát lành, combo xinh yêu cho ngày dài.		true	false	0
item-tra-nhiet-oi-tra-xoai-18	Trà Nhiệt Đới	Trà Xoài	cold	25000	Xoài thơm bùng nổ, chua ngọt hài hòa, uống là auto mê.		true	false	0
item-tra-sua-hoa-nhai-19	Trà Sữa	Hoa Nhài	cold	20000	Hương nhài thơm thoang thoảng, dịu dàng nhưng vẫn siêu cuốn.		true	false	0
item-tra-sua-nguyen-la-20	Trà Sữa	Nguyên Lá	cold	20000	Trà đậm vị thật, sữa béo vừa xinh, uống là ghiền không cần lý do.		true	false	0
item-tra-sua-olong-21	Trà Sữa	Olong	cold	20000	Olong thơm sang, hậu vị sâu, ngọt béo vừa đủ để nhớ mãi.		true	false	0
item-kombucha-ao-22	Kombucha	Đào	cold	20000	Kombucha đào mát chua nhẹ, hợp team thích ngon mà vẫn gọn.		true	false	0
item-kombucha-oi-23	Kombucha	Ổi	cold	20000	Kombucha ổi chua nhẹ vui miệng, uống vào thấy bụng dạ “thank you”.		true	false	0
item-kombucha-vai-24	Kombucha	Vải	cold	20000	Vải ngọt thanh gặp kombucha nhẹ men, refresh đúng nghĩa.		true	false	0
item-kombucha-xoai-25	Kombucha	Xoài	cold	20000	Xoài tropical + kombucha sảng khoái, mood lên ngay từ ngụm đầu.		true	false	0
item-soda-bac-ha-26	Soda	Bạc Hà	cold	20000	Bạc hà mát lạnh max cấp, uống vào tỉnh như vừa ngủ đủ 8 tiếng.		true	false	0
item-soda-blue-27	Soda	Blue	cold	20000	Màu xanh bắt mắt, gas nổ tanh tách, uống là thấy vui phết.		true	false	0
item-soda-dau-28	Soda	Dâu	cold	20000	Dâu ngọt xinh, soda mát đã, hợp chụp ảnh check-in cực phẩm.		true	false	0
item-soda-ao-29	Soda	Đào	cold	20000	Soda đào thơm mát, ngọt dịu, giải nhiệt nhanh không cần nói nhiều.		true	false	0
item-soda-viet-quat-30	Soda	Việt Quất	cold	20000	Việt quất lạ miệng, ngọt thanh, vừa uống vừa thấy sang sang.		true	false	0
item-yogurt-dau-31	Yogurt	Dâu	cold	25000	Yaourt dâu chua ngọt cân bằng, mịn mát ngon kiểu không bị ngán.		true	false	0
item-yogurt-ao-32	Yogurt	Đào	cold	25000	Yaourt đào thơm nhẹ, vị êm, hợp mọi khung giờ trong ngày.		true	false	0
item-yogurt-viet-quat-33	Yogurt	Việt Quất	cold	25000	Yaourt việt quất chua dịu, tươi mát, càng uống càng mê.		true	false	0
item-nuoc-giai-khat-cafe-247-34	Nước Giải Khát	Cafe 247	cold	15000	Cà phê lon quen mặt, tiện gọn lẹ cho ngày chạy task liên tục.		true	false	0
item-nuoc-giai-khat-a-me-35	Nước Giải Khát	Đá Me	cold	15000	Chua ngọt đậm đà, mát lạnh “đã cái nư” mùa nóng.		true	false	0
item-nuoc-giai-khat-mu-gon-hat-e-36	Nước Giải Khát	Mủ Gòn Hạt É	cold	15000	Mát lành giòn vui miệng, uống phát là muốn gọi thêm ly nữa.		true	false	0
item-nuoc-giai-khat-olong-37	Nước Giải Khát	Olong	cold	15000	Trà đóng chai thanh nhẹ, uống dễ, hợp gu nhanh gọn.		true	false	0
item-nuoc-giai-khat-redbull-38	Nước Giải Khát	Redbull	cold	15000	Nhỏ mà lực, cứu cánh cho buổi sáng thiếu pin.		true	false	0
item-nuoc-giai-khat-sting-39	Nước Giải Khát	Sting	cold	15000	Năng lượng nạp nhanh, hợp lúc deadline dí sát gáy.		true	false	0
item-nuoc-giai-khat-sua-au-nanh-40	Nước Giải Khát	Sữa Đậu Nành	cold	15000	Béo dịu, êm bụng, vị thân quen kiểu uống hoài vẫn thích.		true	false	0
```
